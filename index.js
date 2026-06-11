const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("EA Backend is running");
});

// SEARCH ENUMERATION AREA
app.get("/search/:eacode", async (req, res) => {
  const { data, error } = await supabase
    .from("chitungwizaeas")
    .select("*")
    .limit(10);

  res.json({ data, error });
});

// START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});