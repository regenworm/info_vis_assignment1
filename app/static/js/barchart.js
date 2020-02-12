function get_info_on_var (variable) {
    var rel_meta = meta_data.find(function (d) {
        return d.Variabele == variable;
    })

    var label = rel_meta['Label_1'];
    var definition = rel_meta['Definition'];

    return [label, definition]
}

config = {
    figureHeight: 700,
    figureWidth: 1000,
    chartId: "#barchart",
    chartHeight: 400,
    chartWidth: 700,
    x_variables: window.x_variables,
    selectedArea: selected_area
}


function createChart (data, config) {
    const { figureHeight, figureWidth, chartId, chartHeight, chartWidth, x_variables, selectedArea } = config

    // create svg element
    var svgContainer = d3.select("#piechart").append("svg")
        .attr("height", figureHeight)
        .attr("width", figureWidth);

    // create axes
    let x = d3.scaleLinear().rangeRound([0, chartWidth])
    let y = d3.scaleBand().rangeRound([chartHeight, 0]).padding(0.1);

    x.domain([0, 100]);
    console.log(x_variables)
    y.domain(x_variables);

    // create bar chart
    var chartGroup = svgContainer.append("g")
        .attr("id", "chart_group")
        .attr("transform", "translate(" + 100 + "," + 50 + ")");

    // render x axis
    chartGroup.append("g")
        .attr("transform", "translate(" + 0 + "," + chartHeight + ")")
        .call(d3.axisBottom(x));

    // render y axis
    chartGroup.append("g")
        .call(d3.axisLeft(y));

    // label for x-axis
    svgContainer.append("text")
        .attr("transform",
            "translate(" + (figureWidth / 2 - (100 / 2)) + " ," +
            (chartHeight + 100) + ")")
        .style("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Percentage");

    // chart title
    chartGroup.append("text")
        .attr("class", "title")
        .attr("id", "chart-title")
        .attr("y", -25)
        .attr("x", chartWidth / 2)
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Rental statistics of " + selectedArea);

    let map = d3.map(data[0]);
    chartGroup.selectAll(".bar")
        .data(map.entries())
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 1)
        .attr("y", function (d) { return y(d.key) })
        .attr("width", function (d) { return x(d.value); })
        .attr("height", y.bandwidth())
        .on("mouseover", function (d, i) {
            var x_var = d.key;
            var value = d.value;
            var info = get_info_on_var(x_var);
            var label = info[0]
            var definition = info[1];

            displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
                value + "%<br /><b>Explanation: </b>" + definition)
        })
        .on("mousemove", function (d, i) {
            var x_var = d.key;
            var value = d.value;
            var info = get_info_on_var(x_var);
            var label = info[0]
            var definition = info[1];

            displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
                value + "%<br /><b>Explanation: </b>" + definition)
        })
        .on("mouseout", function (d) {
            hideTooltip();
        });

    return { chartGroup, axes: { x, y } }

}
function plotPoints (data, chartGroup, axes, selectedArea, chartWidth) {
    let { x, y } = axes


    let map = d3.map(data[0]);

    let bars = chartGroup.selectAll(".bar")
        .data(map.entries())
        .enter()
        .append("rect")

    bars = bars
        .merge(chartGroup.selectAll(".bar"))
        .on("mouseover", function (d, i) {
            var x_var = d.key;
            var value = d.value;
            var info = get_info_on_var(x_var);
            var label = info[0]
            var definition = info[1];

            displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
                value + "%<br /><b>Explanation: </b>" + definition)
        })
        .on("mousemove", function (d, i) {
            var x_var = d.key;
            var value = d.value;
            var info = get_info_on_var(x_var);
            var label = info[0]
            var definition = info[1];

            displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
                value + "%<br /><b>Explanation: </b>" + definition)
        })
        .on("mouseout", function (d) {
            hideTooltip();
        });

    bars
        .attr("class", "bar")
        .transition()
        .attr("x", 1)
        .attr("y", function (d) { return y(d.key) })
        .duration(300)
        .attr("width", function (d) { return x(d.value); })
        .attr("height", y.bandwidth())



    // chart title
    chartGroup.select("#chart-title")
        .attr("class", "title")
        .attr("id", "chart-title")
        .attr("y", -25)
        .attr("x", chartWidth / 2)
        .style("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Rental statistics of " + selectedArea);
}



let { chartGroup, axes } = createChart(data, config)
plotPoints(data, chartGroup, axes, selected_area, config.chartWidth)

window.createChart = createChart
window.plotPoints = plotPoints
window.chartGroup = chartGroup
window.axes = axes

