const scheduleDatabase = '05252243-3225-4f4b-9af5-7a262fb6d58b';
const ingridientsDatabase = '32ec7c09-9ca9-44e5-9f31-370245e6cfcb';
let ingridients = null;

async function fetchPageTitle(pageId) {
  const response = await fetch(`/fetchPageDetails/${pageId}`);
  const pageDetails = await response.json();
  const pageTitle = `${pageDetails.icon.emoji} ${pageDetails.properties.Name.title[0].plain_text}`;
  return pageTitle;
}

function getIngridientName(cellId) {
  return ingridients[cellId].properties.nazwa.title[0].text.content;
}

async function updateDatabaseItemProperty(itemId, property, value) {
  const response = await fetch(`/updateDatabaseItem/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ property, value }),
  });

  if (!response.ok) {
    throw new Error("Error updating database item property");
  }
}

// Create a hashmap to store the initial magazynValue for each related row ID
const initialMagazynValues = {};

async function fetchRelatedDatabase(pageId) {
  const response = await fetch(`/fetchRelatedPage/${pageId}`);
  const page = await response.json();

  const databaseBlock = page.blocks.find(
    (block) => block.type === "child_database"
  );

  if (databaseBlock) {
    const databaseId = databaseBlock.id;
    const rowsResponse = await fetch(`/fetchDatabaseRows/${databaseId}`);
    const rows = await rowsResponse.json();

    const dataTableBody = document.querySelector("#data-table tbody");

    rows.forEach(async (row) => {
      const magazynValue = row.properties.magazyn.rollup.array[0].number;
      const iloscValue = row.properties.ilosc.number;

      const relatedRowId = row.properties['Składniki'].relation[0].id;

      if (!initialMagazynValues[relatedRowId]) {
        initialMagazynValues[relatedRowId] = magazynValue;
      }

      const subtractionResult = initialMagazynValues[relatedRowId] - iloscValue;
      initialMagazynValues[relatedRowId] = subtractionResult; // Update the initialMagazynValues with the subtraction result

      let existingRow = dataTableBody.querySelector(`tr[data-related-row-id="${relatedRowId}"]`);

      if (existingRow) {
        // Update the existing row
        existingRow.querySelector('.subtraction-cell').textContent = subtractionResult;
      } else {
        // Create a new row and append it to the table body
        const tableRow = document.createElement("tr");
        tableRow.dataset.relatedRowId = relatedRowId;

        const nameCell = document.createElement("td");
        const magazynCell = document.createElement("td");
        const subtractionCell = document.createElement("td");

        subtractionCell.classList.add("subtraction-cell");
        
        nameCell.textContent = getIngridientName(relatedRowId);
        magazynCell.textContent = magazynValue;
        subtractionCell.textContent = subtractionResult;

        tableRow.appendChild(nameCell);
        tableRow.appendChild(magazynCell);
        tableRow.appendChild(subtractionCell);

        dataTableBody.appendChild(tableRow);
      }
    });
  }
}

async function updateDatabaseItems() {
  const dataTableBody = document.querySelector("#data-table tbody");
  const rows = dataTableBody.querySelectorAll("tr");
  const totalRows = rows.length;
  const progressCounter = document.querySelector("#progressCounter");
  let updatedRows = 0;

  for (const row of rows) {
    const relatedRowId = row.dataset.relatedRowId;
    const subtractionResult = parseFloat(row.querySelector(".subtraction-cell").textContent); // Convert to number

    await updateDatabaseItemProperty(relatedRowId, "test", subtractionResult);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Add a 500ms interval between each call

    updatedRows++;
    progressCounter.textContent = `Updated ${updatedRows} / ${totalRows}`;
  }
}

async function getIngridients() {
  try {
    const ingridientsResponse = await fetch(`/fetchDatabaseRows/${ingridientsDatabase}`);
    const ingridients = await ingridientsResponse.json();
    return ingridients.reduce((accumulator, current) => {
      accumulator[current.id] = current;
      return accumulator;
    }, {});
  } catch (error) {
    console.error('Error getting ingredients:', error);
  }
}


document.getElementById("updateButton").addEventListener("click", updateDatabaseItems);

document.getElementById("fetchButton").addEventListener("click", async () => {
  if (!ingridients) {
    ingridients = await getIngridients();
  }

  const scheduleResponse = await fetch(`/fetchDatabaseRows/${scheduleDatabase}`);
  const rows = await scheduleResponse.json();

  const rowsList = document.getElementById("rowsList");
  rowsList.innerHTML = "";

  for (const row of rows) {
    const pageId = row.properties.Przepisy.relation[0]?.id;

    if (pageId) {
      const pageTitle = await fetchPageTitle(pageId);
      const listItem = document.createElement("li");
      listItem.textContent = pageTitle;
      rowsList.appendChild(listItem);
      fetchRelatedDatabase(pageId);
    }
  }
});

