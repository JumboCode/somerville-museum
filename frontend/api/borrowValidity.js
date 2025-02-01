import { query } from './db.js';

export default async function handler(req, res) {
  const { selectedItems } = req.body;

  try {
    // Arrays to keep track of items
    const availableItems = [];
    const unavailableItems = [];

    for (const itemId of selectedItems) {
      // Query the status of each item
      const statusResult = await query(
        'SELECT id, name, status FROM dummy_data WHERE id = $1',
        [itemId]
      );

      const itemDetails = statusResult.rows[0]; // Get item details

      if (!itemDetails) {
        // Handle case where the item doesn't exist in the database
        unavailableItems.push({ id: itemId, reason: "Item not found" });
        continue;
      }

      // If the item is not available, add to unavailable items
      if (itemDetails.status !== 'Available') {
        unavailableItems.push(itemDetails);
        continue; // Skip to the next item
      }

      // Add the item to available items
      availableItems.push(itemDetails);
    }

    // Build the response message
    let message = '';
    if (unavailableItems.length > 0) {
      message += `The following item(s) are not available: ${unavailableItems
        .map((item) => `${item.id}`)
        .join(', ')}. `;
    }

    // Send the response
    res.status(200).json({
      message,
      availableItems,
      unavailableItems,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
