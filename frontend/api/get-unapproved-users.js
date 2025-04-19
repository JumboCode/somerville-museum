export default async function handler(req, res) {
    try {
        const response = await fetch("https://api.clerk.dev/v1/users", {
            headers: {
                Authorization: `Bearer ` + process.env.NEXT_PUBLIC_CLERK_SECRET_KEY,
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
