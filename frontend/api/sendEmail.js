const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    '00abc5ea2cb2dc82c1d4613a4794823f',
    'b74f4b1d4834f8ceee7da28ad504e96d'
);

async function sendEmail() {
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
    } catch (error) {
        console.error("Error sending email:", error);
    }
}


sendEmail();
