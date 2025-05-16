/**
 * @fileoverview All API routes for managing borrow and return operations
 * 
 * @file api/inventoryQueries.js
 * @date 16 February, 2025
 * @authors JumboCode Team
 *  
 */

import { query } from './db.js';

/* Get all condition counts for dashboard graphs */
export async function getConditionHandler(req, res) {
    try {
        const result = await query(`
            SELECT 
                unnest_condition.condition,
                COUNT(*) AS count
            FROM dummy_data,
                unnest(dummy_data.condition) AS unnest_condition(condition)
            GROUP BY unnest_condition.condition;
        `);

        // Prepare pie chart data with the count of each condition
        const pieChartData = result.rows.reduce((acc, row) => {
            acc[row.condition] = row.count;
            return acc;
        }, {});

        res.status(200).json({
            great: pieChartData['Great'] || 0,
            good: pieChartData['Good'] || 0,
            notUsable: pieChartData['Not usable'] || 0,
            needsWashing: pieChartData['Needs washing'] || 0,
            needsDryCleaning: pieChartData['Needs dry cleaning'] || 0,
            needsRepair: pieChartData['Needs repair'] || 0
        });

    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/* Automatically find the next unused ID for adding new item */
export async function getNextAvailableIdHandler(req, res) {
  if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
      // smallest unused id
      const gapResult = await query(`
          SELECT d.id + 1 AS nextId
          FROM dummy_data d
          WHERE NOT EXISTS (
              SELECT 1 FROM dummy_data WHERE id = d.id + 1
          )
          ORDER BY d.id
          LIMIT 1;
      `);

      const maxResult = await query('SELECT COALESCE(MAX(id), 0) AS maxId FROM dummy_data');

      let nextId;
      // use max + 1 if no gaps
      if (gapResult.rows.length > 0) {
          nextId = gapResult.rows[0].nextid;
      } 
      else {
          nextId = maxResult.rows[0].maxid + 1;
      }

      // empty table
      if (maxResult.rows[0].maxid === null) {
          nextId = 1;
      }

      res.status(200).json({ nextId });
  } catch (error) {
      console.error('Error finding next available ID:', error);
      res.status(500).json({ error: 'Database error' });
  }
}

/* Filter item query by calendar selection of dates */
export async function fetchByReturnDateHandler(req, res) {
  try {
      const { startDate, endDate } = req.body;
      
      if (!startDate || !endDate) {
          return res.status(400).json({ error: 'Both start and end dates are required' });
      }

      // Convert UI dates (MM/DD/YYYY) to consistent format for comparison
      // -- Handle both 2-digit and 4-digit years
      const result = await query(`
        SELECT d.id
        FROM dummy_data d
        JOIN borrows b ON b.item_id = d.id
        WHERE 
            CASE 
                WHEN b.return_date LIKE '__/__/__' THEN
                    TO_DATE(b.return_date, 'MM/DD/YY') 
                ELSE
                    TO_DATE(b.return_date, 'MM/DD/YYYY')
            END BETWEEN 
                TO_DATE($1, 'MM/DD/YYYY') AND 
                TO_DATE($2, 'MM/DD/YYYY');
      `, [startDate, endDate]);

      res.status(200).json(result.rows.map(row => row.id));
  } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default async function handler(req, res) {
  const { action } = req.query;
  
  switch(action) {
      case 'getCondition':
          return getConditionHandler(req, res);
      case 'getNextAvailableId':
          return getNextAvailableIdHandler(req, res);
      case 'fetchByReturnDate':
          return fetchByReturnDateHandler(req, res);
      default:
          return res.status(400).json({ error: 'Invalid action' });
  }
}