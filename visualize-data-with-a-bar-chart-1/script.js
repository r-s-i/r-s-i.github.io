// Title
d3.select("body")
  .append("h1")
  .text("United States GDP, 1947-2015")
  .attr("id", "title");

// Canvas:
const canvasWidth = "100%";
const canvasHeight = "100%";
let svg = d3
  .select("body")
  .append("svg")
  .attr("width", canvasWidth)
  .attr("height", canvasHeight);

let width = d3.select("body").node().getBoundingClientRect().width;
let height = d3.select("body").node().getBoundingClientRect().height;

// Offsets:
let yOffset = height * 0.1;
let xOffset = width * 0.15;

// Create x-axis:
let xScale = d3
  .scaleTime()
  .range([0, width * 0.7])
  .domain([new Date(1947, 0, 1), new Date(2015, 9, 1)]);
let xAxis = d3.axisBottom(xScale).ticks(4);

// Create y-axis:
let yAxisLength = height * 0.8;
let yScale = d3.scaleLinear().range([yAxisLength, 0]).domain([0, 20000]);
let yAxis = d3.axisLeft(yScale).ticks(10);

// Append x-axis:
svg
  .append("g")
  .attr("transform", `translate(${xOffset}, ${yAxisLength + yOffset})`)
  .attr("id", "x-axis")
  .call(xAxis);

// Append y-axis:
svg
  .append("g")
  .attr("transform", `translate(${xOffset}, ${yOffset})`)
  .attr("id", "y-axis")
  .call(yAxis);

// Tooltip:
let tooltip = d3.select("body").append("section").attr("id", "tooltip");

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((r) => r.json())
  .then((d) => {
    // Main code goes here
    const data = d["data"];
    // Data bars:
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("x", (d, i) => xOffset + (i * (width * 0.7)) / 275)
      .attr("y", (d, i) => yScale(d[1]) + yOffset - 1)
      .attr("width", (width * 0.8) / d["data"].length)
      .attr("height", (d) => yAxisLength - yScale(d[1]))
      .style("fill", "#00B800")
      .on("mouseover", (d) => {
        d.target.style.fill = "#FE5D6D";
        tooltip.style(
          "left",
          xOffset + Number(d.target.attributes.x.value - 90) + "px"
        );
        tooltip.style("visibility", "visible");
        tooltip.html(
          `Date: ${d.target.__data__[0]} <br> GDP: $${d.target.__data__[1]} Billion`
        );
        tooltip.attr("data-date", d.target.__data__[0]);
      })
      .on("mouseout", (d) => {
        d.target.style.fill = "#00B800";
        tooltip.style("visibility", "hidden");
      });
    // Chart text:
    d3.selectAll("text").style("font-size", "8px");
  })
  .catch((e) => console.error(e));

function update() {
  let width = d3.select("body").node().getBoundingClientRect().width;
  let height = d3.select("body").node().getBoundingClientRect().height;
  let yAxisLength = height * 0.8;
  let yOffset = height * 0.1;
  let xOffset = width * 0.15;

  xScale.range([0, width * 0.7]);
  yScale.range([yAxisLength, 0]);

  d3.select("#x-axis")
    .attr("transform", `translate(${xOffset}, ${yAxisLength + yOffset})`)
    .call(xAxis);
  d3.select("#y-axis")
    .attr("transform", `translate(${xOffset}, ${yOffset})`)
    .call(yAxis);

  svg.attr("width", canvasWidth).attr("height", canvasHeight);

  svg
    .selectAll("rect")
    .attr("x", (d, i) => xOffset + 1 + i * ((width * 0.7) / 275))
    .attr("y", (d) => yScale(d[1]) + yOffset - 1)
    .attr("width", (width * 0.8) / 275)
    .attr("height", (d) => yAxisLength - yScale(d[1]));
}

window.addEventListener("resize", update);
