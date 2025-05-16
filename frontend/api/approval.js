/**
 * @fileoverview Backend API routes for approving new users who have signed up
 * 
 * @file api/approval.js
 * @date 16 February, 2025
 * @authors Massimo Bottari & Dan Glorioso & Elias Swartz
 *  
 */

/* changes new user's metadata on clerk so they can view the site */
export async function approveHandler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { userId } = req.body;

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ` + process.env.CLERK_SECRET_KEY,
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            public_metadata: {
                // Set Clerk metadata to approved
                approved: true
            },
        }),
    });

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to approve user" });
    }

    res.status(200).json({ message: "User approved" });
}

/* fetches all unapproved users and their info */
export async function unapprovedHandler(req, res) {
    try {
        const response = await fetch("https://api.clerk.dev/v1/users", {
            headers: {
                Authorization: `Bearer ` + process.env.CLERK_SECRET_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Clerk API error: ${response.statusText}`);
        }

        const allUsers = await response.json();

        // Check the format of the response
        const usersArray = Array.isArray(allUsers) ? allUsers : allUsers?.data || [];

        const unapprovedUsers = usersArray
            .filter(user => user.public_metadata?.approved !== true)
            .map(user => ({
                id: user.id,
                email: user.email_addresses?.[0]?.email_address || "Unknown",
                name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
            }));

        res.status(200).json({ users: unapprovedUsers });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        res.status(500).json({ error: "Failed to fetch unapproved users" });
    }
}

export default async function handler(req, res) {
  const { action } = req.query;
  
  switch(action) {
      case 'approve':
          return approveHandler(req, res);
      case 'unapproved':
          return unapprovedHandler(req, res);
      default:
          return res.status(400).json({ error: 'Invalid action' });
  }
}