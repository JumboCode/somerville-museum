// pages/api/sendBorrowedEmail.js
const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { recipientEmail, recipientName, items } = req.body;

  if (!recipientEmail || !items || items.length === 0) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const itemList = items.map((item) => `- ${item}`).join("<br/>");

  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "your-email@example.com",
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
            <p>This email serves to confirm that the following item(s) have been borrowed from the Somerville Museum:</p>
            <p>${itemList}</p>
            <p>You will receive another email when the return date approaches.</p>
            <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> and your email will be directed to the appropriate person.</p>
          `,
        },
      ],
    });

    res.status(200).json({ success: true, response: response.body });
  } catch (error) {
    console.error("Error sending borrowed email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
