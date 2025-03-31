import Mailjet from "node-mailjet";
import { query } from "./db.js";

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

// ------------------------- HANDLE CLERK WEBHOOK FOR ADMIN CONFIRMATION -------------------------
async function handleClerkWebhook(req, res) {
    if (req.body.type === "user.created") {
        const user = req.body.data;
        console.log(`New user created: ${user.email_addresses[0].email_address}`);

        // Send confirmation email to admin
        const confirmationLink = `https://yourwebsite.com/api/confirm?email=${user.email_addresses[0].email_address}&action=confirm`;
        const denialLink = `https://yourwebsite.com/api/confirm?email=${user.email_addresses[0].email_address}&action=deny`;

        const htmlContent = `
            <h3>New Account Request</h3>
            <p>A new account request has been submitted by: <strong>${user.first_name} ${user.last_name}</strong> (${user.email_addresses[0].email_address}).</p>
            <p>Please choose an action:</p>
            <a href="${confirmationLink}" style="padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Confirm</a>
            <a href="${denialLink}" style="padding: 12px 24px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px; margin-left: 10px;">Deny</a>
        `;

        await sendEmail({
            to: { email: "admin@example.com", name: "Site Admin" }, // Replace with admin email
            subject: `New Account Request: ${user.first_name} ${user.last_name}`,
            htmlContent,
        });

        return res.status(200).json({ success: true, message: "Admin confirmation email sent." });
    }

    return res.status(400).json({ error: "Unsupported webhook event." });
}

// ------------------------- HANDLE EMAILS -------------------------
export async function handlefetchBorrowerEmail(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: "Missing borrower ID" });
    }

    try {
        const result = await query(`
            SELECT email FROM borrowers WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Borrower not found" });
        }

        res.status(200).json({ borrower_email: result.rows[0].email });
    } catch (error) {
        console.error("Error fetching borrower email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function handlesendBorrowedEmail(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { recipientEmail, recipientName, items } = req.body;

        if (!recipientEmail || !items || items.length === 0) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        const itemList = items.map((item) => `<li>${item}</li>`).join("");

        const htmlContent = `
            <h3>Hi ${recipientName || "there"}!</h3>
            <p>This email confirms you borrowed these items:</p>
            <ul>${itemList}</ul>
            <p>You will receive another email when the return date approaches.</p>
            <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a>.</p>
        `;

        await sendEmail({
            to: { email: recipientEmail, name: recipientName || "Museum Borrower" },
            subject: "Confirmation: Items Borrowed from Somerville Museum",
            htmlContent,
        });

        res.status(200).json({ success: true, message: "Borrowed confirmation email sent." });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message || "Unknown error" });
    }
}

export async function handlesendOverdueEmail(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const result = await query(`
            SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
            FROM borrowed_items
            WHERE due_date < CURRENT_DATE
            GROUP BY borrower_name, borrower_email, due_date
        `);

        for (const { borrower_name, borrower_email, items } of result.rows) {
            const itemList = items.map((item) => `<li>${item}</li>`).join("");

            const htmlContent = `
                <h3>Hi ${borrower_name}!</h3>
                <p>This is a reminder that the following item(s) are <b>OVERDUE</b>:</p>
                <ul>${itemList}</ul>
                <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to arrange your return.</p>
            `;

            await sendEmail({
                to: { email: borrower_email, name: borrower_name },
                subject: "Overdue Notice: Your Borrowed Items Are Past Due",
                htmlContent,
            });
        }

        res.status(200).json({ success: true, message: "Overdue emails sent." });
    } catch (error) {
        console.error("Error sending overdue emails:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// ------------------------- GENERIC EMAIL FUNCTION -------------------------
async function sendEmail({ to, subject, htmlContent }) {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: "somerville.museum1@gmail.com", // Replace with verified sender email
                    Name: "Somerville Museum",
                },
                To: [
                    {
                        Email: to.email,
                        Name: to.name,
                    },
                ],
                Subject: subject,
                HTMLPart: htmlContent,
            },
        ],
    });

    console.log(`Email sent to ${to.email}:`, response.body);
    return response;
}

// ------------------------- MAIN API HANDLER -------------------------
export default async function handler(req, res) {
    if (req.method === "POST" && req.headers["x-clerk-signature"]) {
        // Handle Clerk webhook for user creation
        return handleClerkWebhook(req, res);
    }

    const { emailType } = req.query;

    switch (emailType) {
        case "fetchBorrowerEmail":
            return handlefetchBorrowerEmail(req, res);
        case "sendBorrowedEmail":
            return handlesendBorrowedEmail(req, res);
        case "sendOverdueEmail":
            return handlesendOverdueEmail(req, res);
        default:
            return res.status(400).json({ error: "Invalid email type." });
    }
}