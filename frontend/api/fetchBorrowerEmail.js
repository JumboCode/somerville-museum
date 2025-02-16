import { query } from "./db.js";

export default async function handler(req, res) {
    const { id } = req.query;  // Get borrower ID from query params

    if (!id) {
        return res.status(400).json({ error: "Missing borrower ID" });
    }

    try {
        // Fetch the borrower email using the ID
        const result = await query(`
            SELECT email FROM borrowers WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Borrower not found" });
        }

        res.status(200).json({ borrower_email: result.rows[0].email });
    } catch (error) {
        console.error("Error fetching borrower email:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}