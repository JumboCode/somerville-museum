import { clerkClient } from "@clerk/nextjs/server";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { userId } = req.body;

    try {
        // Allow the user to log in by enabling the account
        await clerkClient.users.updateUser(userId, {
            publicMetadata: { approved: true },
        });

        res.status(200).json({ success: true, message: "User approved successfully." });
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).json({ error: "Failed to approve user." });
    }
}
