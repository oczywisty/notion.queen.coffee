const notion = require("./notionClient");

// Cache for page details
const pageDetailsCache = {};
const cellValueCache = {};

// Function to fetch the database rows (pages)
async function fetchDatabaseRows(databaseId) {
  try {
    const results = [];
    let hasNextPage = true;
    let startCursor = undefined;

    while (hasNextPage) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
      });

      results.push(...response.results);
      hasNextPage = response.has_more;
      startCursor = response.next_cursor;
    }

    return results;
  } catch (error) {
    console.error(`Error fetching the database rows for databaseId: ${databaseId}`, error);
    throw error;
  }
}

async function fetchPage(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });

    const blocks = await notion.blocks.children.list({ block_id: pageId });
    page.blocks = blocks.results;

    return page;
  } catch (error) {
    console.error("Error fetching the page:", error);
    throw error;
  }
}

async function updateDatabaseItemProperty(itemId, property, value) {
  try {
    const response = await notion.pages.update({
      page_id: itemId,
      properties: {
        [property]: {
          number: value,
        },
      },
    });
    return response;
  } catch (error) {
    console.error(`Error updating property '${property}' of the database item:`, error);
    throw error;
  }
}

async function getPageDetails(pageId) {
  try {
    if (pageDetailsCache[pageId]) {
      return pageDetailsCache[pageId];
    }

    const page = await notion.pages.retrieve(pageId);
    pageDetailsCache[pageId] = page;
    return page;
  } catch (error) {
    throw error;
  }
}

async function getDatabaseCellValue(itemId, property) {
  try {
    const cacheKey = `${itemId}-${property}`;

    if (cellValueCache[cacheKey]) {
      return cellValueCache[cacheKey];
    }

    const item = await notion.pages.retrieve({page_id: itemId});
    const value = item.properties[property];

    cellValueCache[cacheKey] = value;

    return value;
  } catch (error) {
    console.error(`Error getting property '${property}' of the database item:`, error);
    throw error;
  }
}

module.exports = {
  fetchDatabaseRows,
  fetchPage,
  updateDatabaseItemProperty,
  getPageDetails,
  getDatabaseCellValue,
};