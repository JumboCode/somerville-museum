// /pages/api/approve-user.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { userId } = req.body;

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer sk_test_wGcUTzeo4CJJ2iVUObnFRmkbaPT6pzAXcnonlv8q8w`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            public_metadata: {
                approved: true,
            },
        }),
    });

    if (!response.ok) {
        return res.status(500).json({ message: "Failed to approve user" });
    }

    res.status(200).json({ message: "User approved" });
}
