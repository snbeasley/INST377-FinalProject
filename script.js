async function fetchData() {
    const appToken = 'hszg6UTvq6TA4EQToCB3lZJ1q';
    const url = `https://opendata.maryland.gov/resource/qtcv-n3tc.json?$$app_token=${appToken}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

  function processDataAndDisplayChart(data) {
    // Uses array methods to transform data
    const countyCounts = data.reduce((acc, record) => {
      const county = record.county;
      acc[county] = (acc[county] || 0) + parseInt(record.count, 10);
      return acc;
    }, {});
  
    // Creates an array of data points for Highcharts
    const chartData = Object.entries(countyCounts).map(([county, count]) => ({ name: county, y: count }));
  
    // Creates a Highcharts.js bar chart
    Highcharts.chart('map', {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'EV Registrations by County'
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Number of Registrations'
        }
      },
      series: [{
        name: 'EV Registrations',
        data: chartData
      }]
    });
  }

  function filterData(data, county) {
    return data.filter(record => record.county.toLowerCase() === county.toLowerCase());
  }
  
  function mainEvent() {
    const loadDataButton = document.querySelector("#data_load");
    const filterButton = document.querySelector("#filter");
    const countySelect = document.querySelector("#county-select");
  
    let storedData = [];
    let currentData = [];
  
    loadDataButton.addEventListener("click", async () => {
      storedData = await fetchData();
      currentData = storedData;
      processDataAndDisplayChart(currentData);
    });
  
    filterButton.addEventListener("click", () => {
        currentData = filterData(storedData, countySelect.value);
        processDataAndDisplayChart(currentData);
    });
  
    countySelect.addEventListener("change", () => {
        currentData = filterData(storedData, countySelect.value);
        processDataAndDisplayChart(currentData);
    });
  }
  
  document.addEventListener("DOMContentLoaded", mainEvent);