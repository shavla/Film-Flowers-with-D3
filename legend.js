const legendWidth = window.innerWidth;
const legendHeight = window.innerHeight *0.8;

const legendSVG = d3
  .select(".legend")
  .append("svg")
  .attr("width", legendWidth)
  .attr("height", legendHeight);

function craeteLegend() {
  createPathGroup();

  createColorGroup();

  createVotesGroup();

  createRatingGroup();
}

function createPathGroup() {
  let pathGroup = createGroup(rated, flowerSize, 0, 50);

  pathGroup
    .append("path")
    .attr("d", (d, i) => petalPaths[i])
    .attr("stroke", "#444")
    .attr("stroke-width", "4px")
    .attr("fill", "white");

  drawText(pathGroup);
}

function createColorGroup() {
  topGenres = getTopGenres(4);
  topGenres.push("Other");

  let defs = legendSVG.append("defs");
  defs
    .append("filter")
    .attr("id", "motionFilter")
    .attr("width", "300%")
    .attr("x", "-100%")
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "5");

  let colorGroup = createGroup(topGenres, colorSize, 50, 140);

  colorGroup
    .append("circle")
    .attr("r", flowerSize / 3)
    .attr("fill", (d, i) => colors[i])
    .style("filter", "url(#motionFilter)");

  drawText(colorGroup);
}

function createVotesGroup() {
  let voteGroup = createGroup(votesTitles, votesSize, 100, 230);

  voteGroup
    .append("g")
    .attr("class", (d, i) => `legend-vote-${i}`)
    .attr("class", (d, i) => {
      let petalQuantitu = numPetalScale(votes[i] * 1000);
      for (let j = 0; j < petalQuantitu; j++) {
        d3.select(`.legend-vote-${i}`)
          .append("path")
          .attr("d", petalPaths[2])
          .attr("transform", `rotate(${(360 / petalQuantitu) * (j + 1)})`)
          .attr("stroke", "#444")
          .attr("stroke-width", "4px")
          .attr("fill", "#00000000");
      }
    })
    .attr("transform", "scale(0.7)");

  drawText(voteGroup);
}

function createRatingGroup() {
  let ratingGroup = createGroup(imdbRatings, ratingSize, 180, 300);

  ratingGroup
    .append("g")
    .attr("class", (d, i) => `legend-rating-${i}`)
    .attr("class", (d, i) => {
      let flowerScale = flowerSizeScale(+imdbRatings[i]);
      for (let j = 0; j < 5; j++) {
        d3.select(`.legend-rating-${i}`)
          .append("path")
          .attr("d", petalPaths[2])
          .attr(
            "transform",
            `rotate(${(360 / 5) * (j + 1)}) scale(${flowerScale * 2})`
          )
          .attr("stroke", "#444")
          .attr("stroke-width", "4px")
          .attr("fill", "#00000000");
      }
    });

  drawText(ratingGroup);
}

function drawText(group) {
  group
    .append("text")
    .text((d) => d)
    .style("transform", "translateY(140px)")
    .style("text-anchor", "middle")
    .style("font-size", "1.5em");
}

function createGroup(data, length, y1, y2) {
  return legendSVG
    .append("g")
    .attr("transform", `translate(${legendWidth / 2}, ${y1})`)
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr(
      "transform",
      (d, i) =>
        `translate(${
          ((i - data.length / 2) * length) / 2 + length / 4
        }, ${y2}) scale(0.5)`
    );
}

function getTopGenres(numberOfTopGenres) {
  let genres = [];

  movies.forEach((movie) => genres.push(...movie["Genre"].split(/[, ]+/)));

  const count = {};
  genres.forEach((item, i) => (count[item] = (count[item] || 0) + 1));
  let sortedCount = Object.entries(count).sort(([, a], [, b]) => b - a);

  sortedCount = sortedCount.flat().filter((item) => typeof item == "string");

  return sortedCount.splice(0, numberOfTopGenres);
}
