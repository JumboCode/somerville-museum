import Mailjet from "node-mailjet";
import { query } from './db.js';

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

export default async function handler(req, res) {
    console.log("Email API received request:", req.method, req.query.type);

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const emailType = req.query.type;
    
    try {
        switch (emailType) {
            case "borrowed":
                await handleBorrowedEmail(req, res);
                break;
            case "overdue":
                await handleOverdueEmail(req, res);
                break;
            case "reminder":
                await handleReminderEmail(req, res);
                break;
            case "return":
                await handleReturnEmail(req, res);
                break;
            default:
                return res.status(400).json({ error: "Invalid email type. Must be one of: borrowed, overdue, reminder, return" });
        }
    } catch (error) {
        console.error(`Error sending ${emailType} email:`, error);
        res.status(500).json({ success: false, error: error.message || "Unknown Mailjet error" });
    }
}

async function handleBorrowedEmail(req, res) {
    const { recipientEmail, recipientName, items } = req.body;

    console.log("Received borrowed email request data:", { recipientEmail, recipientName, items });

    if (!recipientEmail || !items || items.length === 0) {
        console.error("ERROR: Missing required fields.");
        return res.status(400).json({ error: "Missing required fields." });
    }

    const itemList = items.map((item) => `- ${item}`).join("<br/>");
    
    await sendEmail({
        to: { email: recipientEmail, name: recipientName || "Museum Borrower" },
        subject: "Confirmation: Items Borrowed from Somerville Museum",
        htmlContent: `
            <h3>Hi there!</h3>
            <p>This email confirms you borrowed these items:</p>
            <p>${itemList}</p>
            <p>You will receive another email when the return date approaches.</p>
            <p>If you have any questions, please contact <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a>.</p>
        `
    });

    res.status(200).json({ success: true });
}

async function handleOverdueEmail(req, res) {
    // Find all overdue items, grouped by borrower
    const result = await query(`
        SELECT borrower_name, borrower_email, due_date, json_agg(item_name) AS items
        FROM borrowed_items 
        WHERE due_date < CURRENT_DATE
        GROUP BY borrower_name, borrower_email, due_date
    `);

    console.log("Overdue items:", result);

    // Send email to each borrower with overdue items
    for (const { borrower_name, borrower_email, due_date, items } of result) {
        const itemList = formatItemList(items);

        await sendEmail({
            to: { email: borrower_email, name: borrower_name },
            subject: "Overdue Notice: Your Borrowed Items Are Past Due",
            htmlContent: `
                <h3>Hi there!</h3>
                <p>This email is to remind you that the item(s) listed below are <b>OVERDUE</b>:</p>
                <ul>${itemList}</ul>
                <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
            `
        });
    }

    res.status(200).json({ success: true, message: "Overdue emails sent." });
}

async function handleReminderEmail(req, res) {
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
        const itemList = formatItemList(items);

        await sendEmail({
            to: { email: borrower_email, name: borrower_name },
            subject: "Reminder: Your Borrowed Items Are Due Soon",
            htmlContent: `
                <h3>Hi there!</h3>
                <p>This email is to remind you that the item(s) listed below are due to be returned to the Somerville Museum by <b>${due_date}</b>:</p>
                <ul>${itemList}</ul>
                <p>Before returning, please review and act on the applicable guidelines below.</p>
                <p>Please reach out to <a href="mailto:info@somervillemuseum.org">info@somervillemuseum.org</a> to find an appropriate date and time to return your items, or if you have any questions.</p>
            `
        });
    }

    res.status(200).json({ success: true, message: "Reminder emails sent." });
}

async function handleReturnEmail(req, res) {
    const { borrower_name, borrower_email, returned_items } = req.body;

    if (!borrower_email || !borrower_name || !returned_items || returned_items.length === 0) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    console.log(`Sending return confirmation email to ${borrower_email}...`);

    // Format returned items list
    const itemList = formatItemList(returned_items);

    await sendEmail({
        to: { email: borrower_email, name: borrower_name },
        subject: "Confirmation: Your Items Have Been Returned",
        htmlContent: `
            <h3>Hi there!</h3>
            <p>This email serves to confirm that the following item(s) have been returned to the Somerville Museum:</p>
            <ul>${itemList}</ul>
            <p>Thank you so much for volunteering with the Somerville Museum.</p>
        `
    });

    res.status(200).json({ success: true, message: "Return confirmation email sent." });
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

    console.log(`Email sent to ${to.email}:`, response.body);
    return response;
}

function formatItemList(items) {
    return items.map((item) => `<li>${item}</li>`).join("");
}