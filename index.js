// Import required libraries
require('dotenv').config();

const express = require("express");
const { fetchDatabaseRows, fetchPage, updateDatabaseItemProperty, getPageDetails, getDatabaseCellValue } = require("./database");

const app = express();
app.use(express.json());

const port = 3000;

// Serve the frontend files
app.use(express.static("public"));

// Handle the /fetchDatabaseRows endpoint
app.get("/fetchDatabaseRows/:databaseId", async (req, res) => {
  const { databaseId } = req.params;
  try {
    const rows = await fetchDatabaseRows(databaseId);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching database rows");
  }
});

app.get("/fetchRelatedPage/:pageId", async (req, res) => {
  const { pageId } = req.params;

  try {
    const page = await fetchPage(pageId);
    res.json(page);
  } catch (error) {
    console.error("Error fetching the related page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/updateDatabaseItem/:itemId", async (req, res) => {
  const { itemId } = req.params;
  const { property, value } = req.body;

  try {
    await updateDatabaseItemProperty(itemId, property, value);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating database item property");
  }
});

app.get('/fetchPageDetails/:pageId', async (req, res) => {
  const { pageId } = req.params;
  try {
    const page = await getPageDetails({ page_id: pageId });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/getDatabaseCellValue/:itemId/:property", async (req, res) => {
  try {
    const { itemId, property } = req.params;
    const cellValue = await getDatabaseCellValue(itemId, property);
    res.json(cellValue);
  } catch (error) {
    console.error("Error getting cell value:", error);
    res.status(500).json({ message: "Error getting cell value" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
