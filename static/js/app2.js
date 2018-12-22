
var submit = d3.select("#submit1");

submit.on("click", function () {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputValue1 = d3.select("#stock1").property("value");
    var inputValue2 = d3.select("#stock2").property("value");
    var inputValue3 = d3.select("#stock3").property("value");

    var names = [inputValue1, inputValue2, inputValue3];
    plot(names);
    console.log(names);
});


function createChart(seriesOptions) {

    Highcharts.stockChart('plot2', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
}


function plot(names) {
    var seriesOptions = [];
    var seriesCounter = 0;

    $.each(names, function (i, name) {
        $.getJSON('https://www.quandl.com/api/v3/datasets/WIKI/' + name + `.json?start_date=2016-10-01&end_date=2018-04-20&api_key=${apiKey}`,
            function (data) {

                var result = [],
                    result_data = data.dataset.data;
                j = result_data.length - 1;
                for (j; j >= 0; j -= 1) {
                    strs = result_data[j][0].split("-");
                    result.push([
                        Date.UTC(Number(strs[0]), Number(strs[1]), Number(strs[2])),
                        result_data[j][4]
                    ])
                }
                // console.log(result);
                seriesOptions[i] = {
                    name: name,
                    data: result
                };

                // As we're loading the data asynchronously, we don't know what order it will arrive. So
                // we keep a counter and create the chart when all the data is loaded.
                seriesCounter += 1;

                if (seriesCounter === names.length) {
                    // console.log("Create chart");
                    createChart(seriesOptions);
                }
            });
    });
};