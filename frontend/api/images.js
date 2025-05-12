/**************************************************************
 *
 *                     upload.js
 *
 *        Authors: Dan Glorioso & Shayne Sidmnan
 *           Date: 03/07/2025
 *
 *     Summary: An API route to upload images to Cloudflare using R2 storage.
 * 
 **************************************************************/

export async function uploadHandler(req, res) {
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

/**************************************************************
 *
 *                get-images endpoint
 *
 *         Authors: Dan Glorioso
 *            Date: 05/11/2025
 *
 *   Summary: Retrieves a list of image keys stored in Cloudflare R2.
 *
 **************************************************************/

export async function getHandler(req, res) {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    try {
      const response = await fetch("https://upload-r2-assets.somerville-museum1.workers.dev/list", {
        headers: {
          Authorization: `Bearer ${process.env.AUTH_SECRET}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch image list: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Return the image keys directly
      return res.status(200).json({ images: data.images });
    } catch (error) {
      console.error("Retrieval error:", error);
      return res.status(500).json({
        message: "Error retrieving images",
        error: error.message,
      });
    }
  }

export async function deleteHandler(req, res) {
    if (req.method !== "DELETE") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
  
    const { fileName } = req.body;
  
    if (!fileName) {
        return res.status(400).json({ message: "File name is required" });
    }
  
    try {
        const response = await fetch(`https://upload-r2-assets.somerville-museum1.workers.dev/${fileName}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${process.env.AUTH_SECRET}`,
            },
        });
  
        if (!response.ok) {
            throw new Error(`Failed to delete file: ${response.statusText}`);
        }
  
        return res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        console.error("Deletion error:", error);
        return res.status(500).json({
            message: "Error deleting file",
            error: error.message,
        });
    }
}


// Main handler function that routes to the appropriate handler based on the request
export default async function handler(req, res) {
    const { action } = req.query;
    
    switch(action) {
        case 'upload':
            return uploadHandler(req, res);
        case 'get':
            return getHandler(req, res);
        case 'delete':
            return deleteHandler(req, res);
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}