var submit = d3.select("#submit");

submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#patient-form-input");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  console.log(inputValue);
  buildCharts(inputValue);
});


function buildCharts(ticker){

    var url = `/${ticker}`;
    var url_earnings = `/earnings/${ticker}`;

    $.when(
        $.getJSON(url),
        $.getJSON(url_earnings)
    ).done(function(result_data,result_data_earnings){
        data = result_data[0];
        data_earnings = result_data_earnings[0].earnings;
        // console.log(data);
        // console.log(data_earnings);
    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
            'week',                         // unit name
            [1]                             // allowed multiples
        ], [
            'month',
            [1, 2, 3, 4, 6]
        ]],

        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    var earning = [],
    strs = data_earnings[3].EPSReportDate.split("-");
    dict = {
        x:Date.UTC(Number(strs[0]),Number(strs[1]), Number(strs[2])),
        title: (data_earnings[3].actualEPS >= data_earnings[3].estimatedEPS) ? 'Beat':'Miss',
        text:'Actual EPS :' + data_earnings[3].actualEPS + "\n"
              + 'Estimated EPS :' + data_earnings[3].estimatedEPS
    }
    earning.push(dict);
    // console.log(earning);

    // create the chart
    Highcharts.stockChart('plot', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: `${ticker} Stock Price`
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'candlestick',
            name: `${ticker}`,
            data: ohlc,
            dataGrouping: {
                units: groupingUnits
            },
            id: 'dataseries'
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }  
        }, {
            type: 'flags',
            data: earning,
            onSeries: 'dataseries',
            color: (data_earnings[3].actualEPS >= data_earnings[3].estimatedEPS) ? 'green':'red',
            showInLegend: true,
            shape: 'circlepin',
            width: 16
        },{
            type: 'flags',
            onSeries: 'dataseries',
            shape: 'squarepin',
            width: 16,
            color: 'orange',
            data: [{ x: Date.UTC(2012, 6, 20), text: 'Interest', title: '0.25' },
                   { x: Date.UTC(2015, 12, 16), text: 'Interest', title: '0.5' },
                   { x: Date.UTC(2016, 11, 2), text: 'Interest', title: '0.75' },
                   { x: Date.UTC(2017, 3, 15), text: 'Interest', title: '1' },
                   { x: Date.UTC(2017, 6, 14), text: 'Interest', title: '1.25' },
                   { x: Date.UTC(2017, 12, 13), text: 'Interest', title: '1.5' },
                   { x: Date.UTC(2018, 3, 21), text: 'Interest', title: '1.75' } 
                 ]
        }]
    });
  })
};



