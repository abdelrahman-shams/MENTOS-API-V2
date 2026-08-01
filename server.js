require("dotenv").config();

const express = require("express");
const cors = require("cors");
require("./config/db");

const settingsRoutes = require("./routes/settings");
const dashboardRoutes = require("./routes/dashboard");
const accountsRoutes = require("./routes/accounts"); 
const app = express();

app.use(cors());

app.use(express.json());
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/accounts", accountsRoutes);

app.get("/health", (req, res) => {

    res.json({

        success: true,

        status: "online",

        database: "connected"

    });

});

app.get("/", (req, res) => {

    res.send("MENTOS API V2 Running 🚀");

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
