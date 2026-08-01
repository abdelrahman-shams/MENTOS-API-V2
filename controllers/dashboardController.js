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

        const d = result.rows[0];

res.json({

    success: true,

    dashboard: {

        totalAccounts: Number(d.total_accounts),

        activeAccounts: Number(d.active_accounts),

        soldAccounts: Number(d.sold_accounts),

        unsoldAccounts: Number(d.unsold_accounts),

        bannedAccounts: Number(d.banned_accounts),

        totalRevenue: Number(d.total_revenue)

    }

});

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};
