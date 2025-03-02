import { query } from './db.js';

export async function selectByNameHandler(req, res) {
  const { name } = req.body;
  try {
    const result = await query('SELECT * FROM dummy_data WHERE name = $1', [name]);
    // console.log(result.rows);
    res.status(200).json(result.rows); // Send the result back to the frontend
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


export async function selectCountsHandler(req, res) {
    const { name } = req.body;
    try {
      const result = await query('SELECT COUNT(*) FROM dummy_data WHERE status = $1', [name]);
      const count = result.rows[0].count;  // Extract the count from the result
      res.status(200).json({ count });  // Send it as part of an object
    } catch (error) {
      console.error("Database query error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export async function fetchInventoryByTagHandler(req, res) {
    try {
      const filters = req.body;
  
      if (!filters || typeof filters !== 'object') {
        return res.status(400).json({ error: 'Invalid filters format' });
      }
  
      // Specify which columns are stored as arrays in the database
      const arrayColumns = ['color', 'season', 'time_period', 'condition'];
  
      let baseQuery = "SELECT * FROM dummy_data WHERE 1=1";
      let queryParams = [];
      let paramIndex = 1;
  
      for (const [key, values] of Object.entries(filters)) {
        if (values === "NOT NULL" || !Array.isArray(values) || values.length === 0) {
          continue;
        }
  
        if (arrayColumns.includes(key)) {
          baseQuery += ` AND (`;
          const conditions = values.map((_, index) => {
            return `$${paramIndex + index} = ANY(${key})`;
          });
          baseQuery += conditions.join(" AND ") + ")";
        } else {
          baseQuery += ` AND ${key} IN (${values.map((_, index) => `$${paramIndex + index}`).join(", ")})`;
        }
  
        queryParams.push(...values);
        paramIndex += values.length;
      }
  
      // Execute the query with the built query and parameters
      const result = await query(baseQuery, queryParams);
      
      // Return the results
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("DATABASE QUERY ERROR:", error);
      return res.status(500).json({ 
        error: 'Internal Server Error', 
        details: error.message 
      });
    }
  }



export async function fetchTagsHandler(req, res) {
    try {
        // Query the database for all tags
        // const result = await query('SELECT DISTINCT UNNEST(tags) AS tag FROM dummy_data;');

        // Send the result back to the frontend
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export async function filterStatusTagsHandler(req, res) {
    // Fetch status array and tags array from request
    const { status, tags } = req.body;

    // Build query string starting with a blanket WHERE statement
    let queryStr = 'SELECT * FROM dummy_data WHERE 1=1';

    // Bool to track if the first filter
    let hasStatus = false;

    // For every additional filter, append it to the query string
    for (const key in status) {
        // If this is the first filter, add an AND
        if (!hasStatus) {
            queryStr += ' AND ( ';
            hasStatus = true;
        }

        // Add current filter to the query string
        queryStr += ` status = '${status[key]}' OR`;
    }

    // Close parenthesis if there were status filters
    if (hasStatus) {
        queryStr += ' 1=0 )';
    }

    // Bool to track if there are tags in the input selection
    let hasTags = false;

    // Loop through each of the selected tags, apending to query string
    for (const key in tags) {
        // If this is the first filter, add an AND
        if (!hasTags) {
            queryStr += ' AND ( ';
            hasTags = true;
        }

        // Add current filter to the query string
        queryStr += ` '${tags[key]}' = ANY(tags) OR`;
    }

    // Close parenthesis if there were tag filters
    if (hasTags) {
        queryStr += ' 1=0 )';
    }

    // Execute the query string
    try {
        const result = await query(queryStr);
        
        // Send the result back to the frontend
        res.status(200).json(result.rows); 
    } catch (error) {
        console.error("Database query error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


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

  


export default async function handler(req, res) {
    const { action } = req.query;
    
    switch(action) {
        case 'selectByName':
            return selectByNameHandler(req, res);
        case 'selectCounts':
            return selectCountsHandler(req, res);
        case 'fetchInventoryByTag':
            return fetchInventoryByTagHandler(req, res);
        case 'fetchTags':
            return fetchTagsHandler(req, res);
        case 'filterStatusTags':
            return filterStatusTagsHandler(req, res);
        case 'getCondition':
            return getConditionHandler(req, res);
        
    
        default:
            return res.status(400).json({ error: 'Invalid action' });
    }
}