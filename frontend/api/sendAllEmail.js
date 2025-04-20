import Mailjet from "node-mailjet";
import { query } from './db.js';

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { type, recipientEmail, recipientName, items } = req.body;

        if (!type) {
            return res.status(400).json({ error: "Missing email type." });
        }

        let recipients = [];
        let subject = "";
        let htmlContent = "";

        switch (type) {
            case "borrow-confirmation":
                if (!recipientEmail || !items || items.length === 0) {
                    return res.status(400).json({ error: "Missing required fields for borrow confirmation." });
                }

                recipients = [{ Email: recipientEmail, Name: recipientName || "Museum Borrower" }];
                subject = "Confirmation: Items Borrowed from Somerville Museum";
                htmlContent = `
                    <h3>Hi there!</h3>
                    <p>This email confirms you borrowed these items:</p>
                    <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
                    <p>You will receive another email when the return date approaches.</p>
                    <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a>.</p>
                `;
                break;

            case "overdue-notice":
                const overdueItems = await query(`
                    SELECT borrower_name, borrower_email, json_agg(item_name) AS items
                    FROM borrowed_items 
                    WHERE due_date < CURRENT_DATE
                    GROUP BY borrower_name, borrower_email
                `);

                for (const { borrower_name, borrower_email, items } of overdueItems) {
                    recipients.push({ Email: borrower_email, Name: borrower_name });
                    subject = "Overdue Notice: Your Borrowed Items Are Past Due";
                    htmlContent = `
                        <h3>Hi ${borrower_name}!</h3>
                        <p>This email is to remind you that the item(s) listed below are <b>OVERDUE</b>:</p>
                        <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
                        <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to arrange a return.</p>
                    `;
                    await sendEmail(recipients, subject, htmlContent);
                }

                return res.status(200).json({ success: true, message: "Overdue emails sent." });

            case "reminder":
                const upcomingItems = await query(`
                    SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
                    FROM borrowed_items 
                    WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
                    GROUP BY borrower_name, borrower_email, due_date
                `);

                for (const { borrower_name, borrower_email, due_date, items } of upcomingItems) {
                    recipients.push({ Email: borrower_email, Name: borrower_name });
                    subject = "Reminder: Your Borrowed Items Are Due Soon";
                    htmlContent = `
                        <h3>Hi ${borrower_name}!</h3>
                        <p>This email is to remind you that the following item(s) are due back by <b>${due_date}</b>:</p>
                        <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
                        <p>Please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to arrange your return.</p>
                    `;
                    await sendEmail(recipients, subject, htmlContent);
                }

                return res.status(200).json({ success: true, message: "Reminder emails sent." });

            case "return-confirmation":
                if (!recipientEmail || !recipientName || !items || items.length === 0) {
                    return res.status(400).json({ error: "Missing required fields for return confirmation." });
                }

                recipients = [{ Email: recipientEmail, Name: recipientName }];
                subject = "Confirmation: Your Items Have Been Returned";
                htmlContent = `
                    <h3>Hi ${recipientName}!</h3>
                    <p>This email serves to confirm that the following item(s) have been returned:</p>
                    <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
                    <p>Thank you for your support of the Somerville Museum.</p>
                `;
                break;

            default:
                return res.status(400).json({ error: "Invalid email type." });
        }

        // Send the email
        const response = await sendEmail(recipients, subject, htmlContent);
        res.status(200).json({ success: true, response });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function sendEmail(recipients, subject, htmlContent) {
    return await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                To: recipients,
                Subject: subject,
                HTMLPart: htmlContent,
            },
        ],
    });
}