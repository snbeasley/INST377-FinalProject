async function fetchData() {
  const appToken = "hszg6UTvq6TA4EQToCB3lZJ1q";
  const url = `https://opendata.maryland.gov/resource/qtcv-n3tc.json?$$app_token=${appToken}`;

  // Check if data is in localStorage
  const storedData = localStorage.getItem('evData');
  let data;
  if (storedData) {
    console.log('Loading data from localStorage...');
    data = JSON.parse(storedData);
  } else {
    console.log('Fetching data from API...');
    try {
      const response = await fetch(url);
      data = await response.json();
      // Store data in localStorage
      localStorage.setItem('evData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return data;
}

function processDataAndDisplayChart(data) {
  // Uses array methods to transform data
  const countyCounts = data.reduce((acc, record) => {
    const county = record.county;
    acc[county] = (acc[county] || 0) + parseInt(record.count, 10);
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
      height: '700px'
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

function filterData(data, county) {
  return data.filter(
    (record) => record.county.toLowerCase() === county.toLowerCase()
  );
}

function mainEvent() {
  const loadDataButton = document.querySelector("#data_load");
  const clearDataButton = document.querySelector("#data_clear");
  const filterButton = document.querySelector("#filter");
  const countySelect = document.querySelector("#county-select");
  const yearSelect = document.querySelector("#year-select");

  let storedData = [];
  let currentData = [];

  loadDataButton.addEventListener("click", async () => {
    console.log('Load Data Button clicked...');
    storedData = await fetchData();
    currentData = storedData;
    processDataAndDisplayChart(currentData);
  });

  filterButton.addEventListener("click", () => {
    console.log('Filter Button clicked...');
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });

  countySelect.addEventListener("change", () => {
    console.log('County Select changed...');
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });

  yearSelect.addEventListener("change", () => {
    console.log('Year Select changed...');
    currentData = filterData(storedData, countySelect.value, yearSelect.value);
    processDataAndDisplayChart(currentData);
  });

  clearDataButton.addEventListener("click", () => {
    console.log('Clear Data Button clicked...');
    localStorage.clear();
    console.log('localStorage Check', localStorage.getItem("evData"));
  });
}

function correctCountyName(county) {
  return county.replace(/['\s-]/g, "").toUpperCase();
}

function filterData(data, county, year) {
  let filteredData = data;
  if (county) {
    filteredData = filteredData.filter(
      (item) => correctCountyName(item.county) === correctCountyName(county)
    );
  }
  if (year) {
    filteredData = filteredData.filter((item) =>
      item.year_month.startsWith(year)
    );
  }
  return filteredData;
}

document.addEventListener("DOMContentLoaded", mainEvent);
