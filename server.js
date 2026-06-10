const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "zimstat_geoportal",
    password: "Simbarashe7$",
    port: 5432
});

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// EA SEARCH ENDPOINT
app.get("/search/:code", async (req, res) => {
    try {
        const code = req.params.code;

        console.log("Searching for:", code);

        const result = await pool.query(
            `
            SELECT
                "EACODE",
                "PROVINCE",
                "DISTRICT",
                "WARD",
                "SECTOR",
                "EANUMBER",
                "HOUSEHOLDS",
                "POPULATION",
                ST_AsGeoJSON(geom) AS geometry
            FROM "chitungwizaeas"
            WHERE "EACODE" = $1
            `,
            [code]
        );

        console.log("Rows found:", result.rows.length);

        res.json(result.rows);

    } catch (err) {
        console.error("DATABASE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});