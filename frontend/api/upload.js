export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { fileName, fileContent } = req.body;
  
    const workerUrl = `https://upload-r2-assets.somerville-museum1.workers.dev/${fileName}`;
  
    const response = await fetch(workerUrl, {
      method: "PUT",
      body: Buffer.from(fileContent, "base64"),
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
  
    if (!response.ok) {
      return res.status(response.status).json({ message: "Upload failed" });
    }
  
    res.status(200).json({ message: "File uploaded successfully!" });
  }
