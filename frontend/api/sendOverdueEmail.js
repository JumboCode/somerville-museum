import Mailjet from "node-mailjet";
import { query } from './db.js';


const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

export default async function handler(req, res) {
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

        console.log("Overdue items:", result);

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
                            <h3>Hi there!</h3>
                            <p>This email is to remind you that the item(s) listed below are <b>OVERDUE</b>:</p>
                            <ul>${itemList}</ul>
                            <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
                        `,
                    },
                ],
            });

            console.log(`Overdue email sent to ${borrower_email}:`, response.body);
        }

        res.status(200).json({ success: true, message: "Overdue emails sent." });
    } catch (error) {
        console.error("Error sending overdue emails:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
