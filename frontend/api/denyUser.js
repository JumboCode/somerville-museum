import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { userId } = req.body;

    try {
        // Delete or block the user in Clerk
        await clerkClient.users.deleteUser(userId);

        res.status(200).json({ success: true, message: "User denied and deleted." });
    } catch (error) {
        console.error("Error denying user:", error);
        res.status(500).json({ error: "Failed to deny user." });
    }
}
