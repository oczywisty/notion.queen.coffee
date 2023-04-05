<template>
  <div>
    <div class="container">
      <h1>Pieczenie</h1>
      <button id="fetchButton">Pobierz plan pieczenia</button>
      <ul id="rowsList" class="database-list"></ul>

      <table id="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Magazyn (before)</th>
            <th>Magazyn (after)</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <br /><br />
      <button id="updateButton">Zapisz stany magazynowe</button>
      <p id="progressCounter"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainView',
  data() {
    return {
      // Add data properties here
    }
  },
  methods: {
    // Add methods here
  },
  mounted() {
    // Add lifecycle hook logic here
  }
}
</script>
