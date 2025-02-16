import Mailjet from "node-mailjet";

const MJ_APIKEY_PUBLIC='00abc5ea2cb2dc82c1d4613a4794823f'
const MJ_APIKEY_PRIVATE='b74f4b1d4834f8ceee7da28ad504e96d'

const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

export default async function handler(req, res) {
    console.log("Email API received request:", req.method);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { recipientEmail, recipientName, items } = req.body;

        console.log("Received email request data:", { recipientEmail, recipientName, items });

        if (!recipientEmail || !items || items.length === 0) {
            console.error("ERROR: Missing required fields.");
            return res.status(400).json({ error: "Missing required fields." });
        }

        console.log("Sending email to:", recipientEmail);

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
                        <h3>Hi there!</h3>
                        <p>This email confirms you borrowed these items:</p>
                        <p>${itemList}</p>
                        <p>You will receive another email when the return date approaches.</p>
                        <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a>.</p>
                    `,
                },
            ],
        });

        console.log("Mailjet API Response:", response.body);
        res.status(200).json({ success: true, response: response.body });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ success: false, error: error.message || "Unknown Mailjet error" });
    }
}
