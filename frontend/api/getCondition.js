import { query } from './db.js';

export default async function handler(req, res) {
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
