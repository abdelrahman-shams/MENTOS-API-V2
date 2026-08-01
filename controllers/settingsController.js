const db = require("../config/db");

exports.getKey = async (req, res) => {

    try {

        const result = await db.query(
            "SELECT app_key FROM settings WHERE id=1"
        );

        res.json({

            success: true,

            key: result.rows[0]?.app_key || ""

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

exports.updateKey = async (req, res) => {

    try {

        const { key } = req.body;

        await db.query(

            "UPDATE settings SET app_key=$1 WHERE id=1",

            [key]

        );

        res.json({

            success: true,

            message: "Key updated."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};