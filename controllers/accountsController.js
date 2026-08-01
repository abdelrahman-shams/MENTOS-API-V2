const db = require("../config/db");

exports.getAccounts = async (req, res) => {

    try {

        const search = req.query.q || "";

        let query = `
            SELECT
                id,
                email,
                password,
                tag,
                selling_price,
                notes,
                created_at,
                updated_at
            FROM accounts
        `;

        const params = [];

        if (search.trim() !== "") {

            query += `
                WHERE
                    email ILIKE $1
                    OR tag ILIKE $1
                    OR notes ILIKE $1
            `;

            params.push(`%${search}%`);
        }

        query += " ORDER BY id DESC";

        const result = await db.query(query, params);

        res.json({

            success: true,

            accounts: result.rows

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
exports.addAccount = async (req, res) => {

    try {

        let {
            email,
            password,
            tag,
            selling_price,
            notes
        } = req.body;

        if (!email || !password || !tag) {

            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });

        }

        const allowedTags = [
            "ACTIVE",
            "UNSOLD",
            "SOLD",
            "BANNED"
        ];

        if (!allowedTags.includes(tag)) {

            return res.status(400).json({
                success: false,
                message: "Invalid tag."
            });

        }

        if (tag === "SOLD" &&
            (selling_price === null ||
             selling_price === undefined ||
             selling_price === "")) {

            return res.status(400).json({
                success: false,
                message: "Selling price is required."
            });

        }

        const exists = await db.query(

            "SELECT id FROM accounts WHERE email=$1",

            [email]

        );

        if (exists.rows.length > 0) {

            return res.status(409).json({

                success: false,

                message: "Email already exists."

            });

        }

        const now = new Date().toISOString();

        const result = await db.query(

            `INSERT INTO accounts
            (
                email,
                password,
                tag,
                selling_price,
                notes,
                created_at,
                updated_at
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7
            )
            RETURNING id`,

            [

                email,

                password,

                tag,

                tag === "SOLD"
                    ? selling_price
                    : null,

                notes || null,

                now,

                now

            ]

        );

        res.status(201).json({

            success: true,

            id: result.rows[0].id,

            message: "Account added successfully."

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
exports.updateAccount = async (req, res) => {

    try {

        const id = Number(req.params.id);

        let {

            email,
            password,
            tag,
            selling_price,
            notes

        } = req.body;

        const allowedTags = [

            "ACTIVE",
            "UNSOLD",
            "SOLD",
            "BANNED"

        ];

        if (!email || !password || !tag) {

            return res.status(400).json({

                success: false,

                message: "Email, password and tag are required."

            });

        }

        if (!allowedTags.includes(tag)) {

            return res.status(400).json({

                success: false,

                message: "Invalid tag."

            });

        }

        if (tag !== "SOLD") {

            selling_price = null;

        }

        const now = new Date().toISOString();

        const result = await db.query(

            `UPDATE accounts
            SET
                email=$1,
                password=$2,
                tag=$3,
                selling_price=$4,
                notes=$5,
                updated_at=$6
            WHERE id=$7`,

            [

                email,

                password,

                tag,

                selling_price,

                notes || null,

                now,

                id

            ]

        );

        if (result.rowCount === 0) {

            return res.status(404).json({

                success: false,

                message: "Account not found."

            });

        }

        res.json({

            success: true,

            message: "Account updated successfully."

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
exports.deleteAccount = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const result = await db.query(

            "DELETE FROM accounts WHERE id=$1",

            [id]

        );

        if (result.rowCount === 0) {

            return res.status(404).json({

                success: false,

                message: "Account not found."

            });

        }

        res.json({

            success: true,

            message: "Account deleted successfully."

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