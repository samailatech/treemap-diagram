// Set dimensions and margins
const width = 960;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// Create SVG container
const svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

// Create a treemap layout
const treemap = d3.treemap()
    .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
    .padding(2);

// Load data
d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json").then(data => {
    // Create hierarchy from the data
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    // Draw tiles
    svg.selectAll(".tile")
        .data(root.leaves())
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", d => d.x0 + margin.left)
        .attr("y", d => d.y0 + margin.top)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .attr("fill", d => colorScale(d.data.category))
        .on("mouseover", (event, d) => {
            d3.select("#tooltip")
                .style("opacity", 1)
                .attr("data-value", d.data.value)
                .html(`<strong>Name:</strong> ${d.data.name}<br>
                       <strong>Category:</strong> ${d.data.category}<br>
                       <strong>Value:</strong> ${d.data.value}`);
        })
        .on("mousemove", (event) => {
            d3.select("#tooltip")
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            d3.select("#tooltip").style("opacity", 0);
        });

    // Create color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create legend
    const legend = svg.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${width - 200},20)`);

    const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));
    const legendItems = legend.selectAll(".legend-item")
        .data(categories)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendItems.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d => colorScale(d));

    legendItems.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .text(d => d);

});
