export default async function handler(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer sk_test_wGcUTzeo4CJJ2iVUObnFRmkbaPT6pzAXcnonlv8q8w`, // GET RID OF HARDCODED EVENTUALLY
      },
    });
  
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch user from Clerk" });
    }
  
    const user = await response.json();
  
    const approved = user.public_metadata?.approved === true;
    res.status(200).json({ approved });
  }
  