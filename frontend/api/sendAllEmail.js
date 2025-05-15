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
                    <p>This email serves to confirm that the following item(s) have been borrowed from the Somerville Museum:</p>
                    <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
                    <p>You will receive another email when the return date approaches.</p>
                    <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> 
                       and your email will be directed to the appropriate person. Please return your items in the same conidtion
                       as when you received them and in the same or a better bag or container.</p>
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
                        <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> 
                           to find an appropriate date and time to return your items, or if you have any questions.</p>
                    `;
                    await sendEmail(recipients, subject, htmlContent);
                }

                return res.status(200).json({ success: true, message: "Overdue emails sent." });

            case "reminder":
                const upcomingItems = await query(`
                    SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
                    FROM borrowed_items 
                    WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '5 days'
                    GROUP BY borrower_name, borrower_email, due_date
                `);

                for (const { borrower_name, borrower_email, due_date, items } of upcomingItems) {
                    recipients.push({ Email: borrower_email, Name: borrower_name });
                    subject = "Reminder: Your Borrowed Items Are Due Soon";
                    htmlContent = `
                        <h3>Hi ${borrower_name}!</h3>
                        <p>This email is to remind you that the following item(s) to be reutned to the Somerville Museum by <b>${due_date}</b>:</p>
                        <ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>
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
                    <p>Thank you for volunteering with the Somerville Museum.</p>
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