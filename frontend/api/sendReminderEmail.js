import Mailjet from "node-mailjet";
import { query } from './db.js';

const MJ_APIKEY_PUBLIC='00abc5ea2cb2dc82c1d4613a4794823f'
const MJ_APIKEY_PRIVATE='b74f4b1d4834f8ceee7da28ad504e96d'

const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // Find items due in the next 3 days
        const result = await query(`
            SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
            FROM borrowed_items 
            WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
            GROUP BY borrower_name, borrower_email, due_date
        `);

        console.log("Items due soon:", result);

        // Send reminder emails for each borrower
        for (const { borrower_name, borrower_email, due_date, items } of result) {
            const itemList = items.map((item) => `<li>${item}</li>`).join(""); // Format as bullet points

            const response = await mailjet.post("send", { version: "v3.1" }).request({
                Messages: [
                    {
                        From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                        To: [{ Email: borrower_email, Name: borrower_name }],
                        Subject: "Reminder: Your Borrowed Items Are Due Soon",
                        HTMLPart: `
                            <h3>Hi there!</h3>
                            <p>This email is to remind you that the item(s) listed below are due to be returned to the Somerville Museum by <b>${due_date}</b>:</p>
                            <ul>${itemList}</ul>
                            <p>Before returning, please review and act on the applicable guidelines below.</p>
                            <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
                        `,
                    },
                ],
            });

            console.log(`Reminder email sent to ${borrower_email}:`, response.body);
        }

        res.status(200).json({ success: true, message: "Reminder emails sent." });
    } catch (error) {
        console.error("Error sending reminder emails:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
