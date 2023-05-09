
async function fetchData() {
    const appToken = 'hszg6UTvq6TA4EQToCB3lZJ1q';
    const url = `https://opendata.maryland.gov/resource/qtcv-n3tc.json?$$app_token=${appToken}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      processDataAndDisplayChart(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  fetchData();
  

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
  