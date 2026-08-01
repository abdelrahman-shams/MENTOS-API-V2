const db = require("../config/db");

exports.getDashboard = async (req, res) => {

    try {

        const result = await db.query(`
            SELECT
                COUNT(*)::int AS total_accounts,

                COUNT(*) FILTER (
                    WHERE tag = 'ACTIVE'
                )::int AS active_accounts,

                COUNT(*) FILTER (
                    WHERE tag = 'SOLD'
                )::int AS sold_accounts,

                COUNT(*) FILTER (
                    WHERE tag = 'UNSOLD'
                )::int AS unsold_accounts,

                COUNT(*) FILTER (
                    WHERE tag = 'BANNED'
                )::int AS banned_accounts,

                COALESCE(
                    SUM(selling_price),
                    0
                ) AS total_revenue

            FROM accounts;
        `);

        res.json({

            success: true,

            dashboard: result.rows[0]

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};