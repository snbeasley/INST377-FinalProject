// Function to fetch data from the API or local storage
async function fetchData() {
  const appToken = "hszg6UTvq6TA4EQToCB3lZJ1q";
  const url = `https://opendata.maryland.gov/resource/qtcv-n3tc.json?$$app_token=${appToken}`;

  // Check if data is in localStorage
  const storedData = localStorage.getItem("evData");
  let data;
  if (storedData) {
    // If data exists in local storage, load from there
    console.log("Loading data from localStorage...");
    data = JSON.parse(storedData);
  } else {
    // If not, fetch data from API
    console.log("Fetching data from API...");
    try {
      const response = await fetch(url);
      data = await response.json();
      // Stores the fetched data in localStorage
      localStorage.setItem("evData", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return data;
}

// Function to process the fetched data and display it in a Highcharts chart
function processDataAndDisplayChart(data) {
  // Uses array method to transform data
  // Reduce data array into an object with county counts
  const countyCounts = data.reduce((acc, record) => {
    // Set the county name
    const county = record.county;
    // Increment the count for the county or initialize if not yet in acc
    acc[county] = (acc[county] || 0) + parseInt(record.count, 10);
     // Return the updated accumulator
    return acc;
  }, {});

  // Creates an array of data points for Highcharts
  const chartData = Object.entries(countyCounts).map(([county, count]) => ({
    name: county,
    y: count,
  }));

  // Creates a Highcharts.js bar chart
  Highcharts.chart("map", {
    chart: {
      type: "bar",
      height: "700px",
    },
    title: {
      text: "EV Registrations by County",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      title: {
        text: "Number of Registrations",
      },
    },
    series: [
      {
        name: "EV Registrations",
        data: chartData,
        minPointLength: 5,
      },
    ],
  });
}

// Function to filter data based on selected county
function filterData(data, county) {
  return data.filter(
    (record) => record.county.toLowerCase() === county.toLowerCase()
  );
}

// Function to set up event handlers for buttons and select elements
function mainEvent() {
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const filterButton = document.querySelector("#filter");
  const countySelect = document.querySelector("#county-select");
  const yearSelect = document.querySelector("#year-select");

  let storedData = [];
  let currentData = [];

  // Load data when Load Data button is clicked
  loadDataButton.addEventListener("click", async () => {
    console.log("Load Data Button clicked...");
    storedData = await fetchData();
    currentData = storedData;
    processDataAndDisplayChart(currentData);
  });
  // Filters data when Filter button is clicked
  filterButton.addEventListener("click", () => {
    console.log("Filter Button clicked...");
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });
  // Filters data when County Select value is changed
  countySelect.addEventListener("change", () => {
    console.log("County Select changed...");
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });
  // Filters data when Year Select value is changed
  yearSelect.addEventListener("change", () => {
    console.log("Year Select changed...");
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });
  // Clears data when Clear Data button is clicked
  clearDataButton.addEventListener("click", () => {
    console.log("Clear Data Button clicked...");
    localStorage.clear();
    console.log("localStorage Check", localStorage.getItem("evData"));
  });
}
// Function to reformat county names so they can be properly filtered.
function correctCountyName(county) {
  return county.replace(/['\s-]/g, "").toUpperCase();
}

// Function to filter data based on selected county and year
function filterData(data, county, year) {
  // Copies the original data.
  let filteredData = data;

  // If county is selected, filter data by county.
  if (county) {
    filteredData = filteredData.filter(
      (item) => correctCountyName(item.county) === correctCountyName(county)
    );
  }
  // If year is selected, filter data by year.
  if (year) {
    filteredData = filteredData.filter((item) =>
      item.year_month.startsWith(year)
    );
  }
  // Returns the filtered data.
  return filteredData;
}

document.addEventListener("DOMContentLoaded", async () => mainEvent());
