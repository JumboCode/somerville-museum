/**************************************************************
 *
 *                   get-images.js
 *
 *         Authors: Dan Glorioso
 *            Date: 05/11/2025
 *
 *   Summary: Retrieves a list of image keys stored in Cloudflare R2.
 *
 **************************************************************/

export default async function handler(req, res) {
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
  