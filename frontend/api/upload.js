export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { fileName, fileContent } = req.body;

  try {
    // Convert base64 file content to binary data
    const base64Data = fileContent.split(",")[1]; // Remove data prefix
    const binaryData = Buffer.from(base64Data, "base64");

    const workerURL = `https://upload-r2-assets.somerville-museum1.workers.dev/${fileName}`;

    // Upload the file
    const response = await fetch(workerURL, {
      method: "PUT",
      body: binaryData,
      headers: {
        "Authorization": `Bearer ${process.env.AUTH_SECRET}`
      },
    });

    if (!response.ok) {
      console.error("Response was not ok!!");
      return res.status(response.status).json({ message: "Upload failed" });
    }

    res.status(200).json({ message: "File uploaded successfully!" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
