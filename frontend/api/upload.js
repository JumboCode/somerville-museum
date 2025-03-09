export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
    const { fileNames, fileContents } = req.body;
    // Ensure fileNames and fileContents have the same length
    if (!fileNames || !fileContents || fileNames.length !== fileContents.length) {
        return res.status(400).json({ message: "Invalid file data" });
    }
    try {
        // Upload all files in parallel using Promise.all()
        const uploadPromises = fileNames.map((fileName, index) => {
            const base64Data = fileContents[index].split(",")[1]; // Remove data prefix
            const binaryData = Buffer.from(base64Data, "base64");
            const workerURL = `https://upload-r2-assets.somerville-museum1.workers.dev/${fileName}`;
            return fetch(workerURL, {
                method: "PUT",
                body: binaryData,
                headers: {
                    "Authorization": `Bearer ${process.env.AUTH_SECRET}`
                },
            }).then(response => {
                if (!response.ok) throw new Error(`Upload failed for ${fileName}`);
                return response;
            });
        });
        // Wait for all uploads to complete
        if (fileNames.length > 0) {
          await Promise.all(uploadPromises);
        }
        res.status(200).json({ message: "All files uploaded successfully!" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }