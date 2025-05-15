import Mailjet from "node-mailjet";
import { query } from './db.js';

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

export async function handlefetchBorrowerEmail(req, res) {
    const { id } = req.query;  // Get borrower ID from query params

    if (!id) {
        return res.status(400).json({ error: "Missing borrower ID" });
    }

    try {
        // Fetch the borrower email using the ID
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
        const { recipientEmail, recipientName, items, returnDate } = req.body;

        if (!recipientEmail || !items || items.length === 0) {
            console.error("ERROR: Missing required fields.");
            return res.status(400).json({ error: "Missing required fields." });
        }

        const itemList = items.map((item) => `- ${item}`).join("<br/>");

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: "somerville.museum1@gmail.com",  // Replace with verified sender email
                        Name: "Somerville Museum",
                    },
                    To: [
                        {
                            Email: recipientEmail,
                            Name: recipientName || "Museum Borrower",
                        },
                    ],
                    Subject: "Confirmation: Items Borrowed from Somerville Museum",
                    HTMLPart: `
                        <p>Hi ${recipientName}!</p>
                        <p>This email confirms you borrowed these items:</p>
                        <p>${itemList}</p>
                        <p>They are due for return on ${returnDate}.You will receive another email when the return date approaches.</p>
                        <p>
                            If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> 
                            and your email will be directed to the appropriate person. Please return your items in the same conidtion
                            as when you received them and in the same or a better bag or container.
                        </p>
                    `,
                },
            ],
        });

        res.status(200).json({ success: true, response: response.body });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message || "Unknown Mailjet error" });
    }
}


export async function handlesendOverdueEmail(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Find all overdue items, grouped by borrower
        const result = await query(`
            SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
            FROM borrowed_items 
            WHERE due_date < CURRENT_DATE
            GROUP BY borrower_name, borrower_email, due_date
        `);

        // SEND EMAIL TO EACH BORROWER WITH OVERDUE ITEMS
        for (const { borrower_name, borrower_email, due_date, items } of result) {
            const itemList = items.map((item) => `<li>${item}</li>`).join("");

            const response = await mailjet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                        To: [{ Email: borrower_email, Name: borrower_name }],
                        Subject: "Overdue Notice: Your Borrowed Items Are Past Due",
                        HTMLPart: `
                            <p>Hi ${borrower_name}!</p>
                            <p>This email is to remind you that the item(s) listed below are <b>OVERDUE</b>:</p>
                            <ul>${itemList}</ul>
                            <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
                        `,
                    },
                ],
            });
        }

        res.status(200).json({ success: true, message: "Overdue emails sent." });
    } catch (error) {
        console.error("Error sending overdue emails:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function handlesendReminderEmail(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Find items due in the next 3 days
        const result = await query(`
            SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
            FROM borrowed_items 
            WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '5 days'
            GROUP BY borrower_name, borrower_email, due_date
        `);

        // SEND EMAIL TO EACH BORROWER WITH ITEMS DUE SOON
        for (const { borrower_name, borrower_email, due_date, items } of result) {
            const itemList = items.map((item) => `<li>${item}</li>`).join("");

            const response = await mailjet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                        To: [{ Email: borrower_email, Name: borrower_name }],
                        Subject: "Reminder: Your Borrowed Items Are Due Soon",
                        HTMLPart: `
                            <p>Hi ${borrower_name}!</p>
                            <p>This email is to remind you that the following item(s) to be reutned to the Somerville Museum by <b>${due_date}</b>:</p>
                            <ul>${itemList}</ul>
                            <p>Before returning, please review and act on the applicable guidelines below.
                           Please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to arrange your return.</p>
                        <p><b>Guidelines:</b></p>
                        <p>
                            Please return your items in the same or better condition than when you received them. 
                            If changes in condition have occurred, please let us know. Some issues that arise include 
                            the loss of a button or hook.  Please try to find these items and keep these with the garment 
                            when you return it. 
                        </p>
                        <p>
                            White or off-white garments made out of cotton, such as socks, shirts, or women’s shirts 
                            or chemise, should be cleaned before returning.  These objects can be washed in a washing 
                            machine on delicate cycle with a fragrance-free detergent and dried in a dryer on low heat. 
                            Do not overheat or some shrinking may occur. Hang these items on hangers when taking them out 
                            of the dryer to reduce wrinkling until you have time to bring them back to the Museum. When 
                            folding them to fit in your bag, try to smooth out the wrinkles.
                        </p>
                        <p>
                            Garment items that are often missed in returns include: socks and accessories such as belts, 
                            pockets, fichu or neckerchiefs, pins, jewelry, bobby pins and safety pins.  Please return 
                            everything to avoid us having to track you down.  Thank you!
                        </p>
                        `,
                    },
                ],
            });
        }
    res.status(200).json({ success: true, message: "Reminder emails sent." });
    } catch (error) {
        console.error("Error sending reminder emails:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}


export async function handlesendReturnEmail(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { borrower_name, borrower_email, returned_items } = req.body;

        if (!borrower_email || !borrower_name || !returned_items || returned_items.length === 0) {
            return res.status(400).json({ error: "Missing required fields." });
        }


        // Format returned items list
        const itemList = returned_items.map((item) => `<li>${item}</li>`).join("");

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                    To: [{ Email: borrower_email, Name: borrower_name }],
                    Subject: "Confirmation: Your Items Have Been Returned",
                    HTMLPart: `
                        <p>Hi ${borrower_name}!</p>
                        <p>This email serves to confirm that the following item(s) have been returned to the Somerville Museum:</p>
                        <ul>${itemList}</ul>
                        <p>Thank you so much for volunteering with the Somerville Museum.</p>
                    `,
                },
            ],
        });

        res.status(200).json({ success: true, message: "Return confirmation email sent." });
    } catch (error) {
        console.error("Error sending return confirmation email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}


/*---------------------------functions below not from elias + massimo----------*/


async function handleReminderEmail(req, res) {
    // Find items due in the next 3 days
    const result = await query(`
        SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
        FROM borrowed_items 
        WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
        GROUP BY borrower_name, borrower_email, due_date
    `);

    // Send reminder emails for each borrower
    for (const { borrower_name, borrower_email, due_date, items } of result) {
        const itemList = formatItemList(items);

        await sendEmail({
            to: { email: borrower_email, name: borrower_name },
            subject: "Reminder: Your Borrowed Items Are Due Soon",
            htmlContent: `
                <p>Hi there!</p>
                <p>This email is to remind you that the item(s) listed below are due to be returned to the Somerville Museum by <b>${due_date}</b>:</p>
                <ul>${itemList}</ul>
                <p>Before returning, please review and act on the applicable guidelines below.</p>
                <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
            `
        });
    }

    res.status(200).json({ success: true, message: "Reminder emails sent." });
}



async function sendEmail({ to, subject, htmlContent }) {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: "somerville.museum1@gmail.com",
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

    return response;
}

function formatItemList(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
}



export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { emailType } = req.query;
    
    switch (emailType) {
        case 'reminder':
            return handleReminderEmail(req, res);
        case 'fetchBorrowerEmail':
            return handlefetchBorrowerEmail(req, res);
        case 'sendBorrowedEmail':
            return handlesendBorrowedEmail(req, res);
        case 'sendOverdueEmail':
            return handlesendOverdueEmail(req, res);
        case 'sendReturnEmail':
            return handlesendReturnEmail(req, res);
        default:
            return res.status(400).json({ error: "Invalid email type." });
    }
}