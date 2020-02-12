function get_info_on_var_pie (variable) {
  var rel_meta = meta_data.find(function (d) {
    return d.Variabele == variable;
  })

  var label = rel_meta['Label_1'];
  var definition = rel_meta['Definition'];

  return [label, definition]
}

function createPie (data, title) {
  console.log('title', title, data)
  data = data.map(x => ({ 'key': x[0], 'value': x[1] }))
  var width = 300,
    height = 500,
    radius = Math.min(width, height) / 2;

  var color = d3.scaleOrdinal()
    .range(
      ['#82df7f',
        '#9be598',
        '#b4ebb2',
        '#cdf2cb',
        '#e6f8e5',
        '#f2fbf2']);

  var arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  var pie = d3.pie()
    .sort(null)
    .value(function (d) { return d.value; });

  var svg = d3.select("#piechart").append("svg")
    .attr("id", title.split(' ')[0])
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc")

  g.append("path")
    .attr("class", "path")
    .attr("d", arc)
    .style("fill", function (d) { return color(d.data.value); })
    .on("mouseover", function (d, i) {
      var x_var = d.data.key;
      var value = d.data.value;
      var info = get_info_on_var_pie(x_var);
      var label = info[0]
      var definition = info[1];

      displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
        value + "%<br /><b>Explanation: </b>" + definition)
    })
    .on("mousemove", function (d, i) {
      var x_var = d.data.key;
      var value = d.data.value;
      var info = get_info_on_var_pie(x_var);
      var label = info[0]
      var definition = info[1];

      displayTooltip("<b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
        value + "%<br /><b>Explanation: </b>" + definition)
    })
    .on("mouseout", function (d) {
      hideTooltip();
    });

  g.append("text")
    .attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .text(function (d) { return d.data.key; });


  svg.append("text")
    .attr("class", "title")
    .attr("id", "chart-title")
    .attr("y", -(width / 2))
    .attr("x", 0)
    .style("font-size", "0.65em")
    .style("font-weight", "bold")
    .style("text-anchor", "middle")
    .text(title);

  return svg
}

function createPies (data, selectedArea) {
  tupleData = Object.entries(data[0])
  surface = tupleData.filter(x => x[0].includes('WOPP'))
  price = tupleData.filter(x => x[0].includes('WHUUR'))
  type = tupleData.filter(x => x[0].includes('WCOR') || x[0].includes('WPART'))

  surface = createPie(surface, `Surface area of rental properties in ${selectedArea}`)
  price = createPie(price, `Price segment of rental properties in ${selectedArea}`)
  type = createPie(type, `Type of rental properties in ${selectedArea}`)
  return { surface, price, type }
}

function updatePie (oldPie, data, title) {
  var width = 300,
    height = 500,
    radius = Math.min(width, height) / 2;

  var labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);

  let arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  var pie = d3.pie()
    .value(function (d) { return d.value; })(data);
  path = d3.select("#pie").selectAll("path").data(pie); // Compute the new angles
  path.attr("d", arc); // redrawing the path
  d3.selectAll("text").data(pie).attr("transform", function (d) { return "translate(" + labelArc.centroid(d) + ")"; }); // recomputing the centroid and translating the text accordingly.

}

function updatePies (pies, data, selectedArea) {
  tupleData = Object.entries(data[0])
  surface = tupleData.filter(x => x[0].includes('WOPP'))
  price = tupleData.filter(x => x[0].includes('WHUUR'))
  type = tupleData.filter(x => x[0].includes('WCOR') || x[0].includes('WPART'))


  surface = updatePie(pies.surface, data, `Surface area of rental properties in ${selectedArea}`)
  price = updatePie(pies.price, data, `Price segment of rental properties in ${selectedArea}`)
  type = updatePie(pies.type, data, `Type of rental properties in ${selectedArea}`)

}

window.updatePies = updatePies
window.pies = createPies(data, window.selected_area)
