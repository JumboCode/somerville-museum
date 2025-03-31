import { query } from "./db.js";

export default async function handler(req, res) {
    const { email, action } = req.query;

    if (!email || !action) {
        return res.status(400).json({ error: "Missing email or action." });
    }

    try {
        if (action === "confirm") {
            // Update user status to confirmed
            await query(`UPDATE users SET status = 'confirmed' WHERE email = $1`, [email]);
            console.log(`User ${email} has been confirmed.`);
            return res.status(200).send("<h3>User account has been confirmed successfully.</h3>");
        } 
        else if (action === "deny") {
            // Mark user as denied or delete the user
            await query(`DELETE FROM users WHERE email = $1`, [email]);
            console.log(`User ${email} has been denied.`);
            return res.status(200).send("<h3>User account request has been denied.</h3>");
        } 
        else {
            return res.status(400).json({ error: "Invalid action." });
        }
    } catch (error) {
        console.error("Error processing admin action:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}