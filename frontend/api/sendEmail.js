import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const response = await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: "your-email@example.com",
                        Name: "Your Name"
                    },
                    To: [
                        {
                            Email: "recipient@example.com",
                            Name: "Recipient Name"
                        }
                    ],
                    Subject: "Test Email from Mailjet",
                    TextPart: "Hello! This is a test email from Mailjet using Node.js.",
                    HTMLPart: "<h3>Hello!</h3><p>This is a test email from <strong>Mailjet</strong> using Node.js.</p>"
                }
            ]
        });

        console.log("Email sent successfully:", response.body);
        return res.status(200).json({ message: "Email sent successfully!" });

    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
    }
}
