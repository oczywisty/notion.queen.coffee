// Import required libraries
const { Client } = require("@notionhq/client");

// Initialize the Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY, // Set your API key as an environment variable
  notionVersion: "2022-06-28", // Specify the latest API version
});

module.exports = notion;
