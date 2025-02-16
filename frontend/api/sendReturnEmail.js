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
        const { borrower_name, borrower_email, returned_items } = req.body;

        if (!borrower_email || !borrower_name || !returned_items || returned_items.length === 0) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        console.log(`Sending return confirmation email to ${borrower_email}...`);

        // Format returned items list
        const itemList = returned_items.map((item) => `<li>${item}</li>`).join("");

        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: { Email: "somerville.museum1@gmail.com", Name: "Somerville Museum" },
                    To: [{ Email: borrower_email, Name: borrower_name }],
                    Subject: "Confirmation: Your Items Have Been Returned",
                    HTMLPart: `
                        <h3>Hi there!</h3>
                        <p>This email serves to confirm that the following item(s) have been returned to the Somerville Museum:</p>
                        <ul>${itemList}</ul>
                        <p>Thank you so much for volunteering with the Somerville Museum.</p>
                    `,
                },
            ],
        });

        console.log(`Return confirmation email sent to ${borrower_email}:`, response.body);
        res.status(200).json({ success: true, message: "Return confirmation email sent." });
    } catch (error) {
        console.error("Error sending return confirmation email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
