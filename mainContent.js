const contentWidth = window.innerWidth;
const contentHeight = window.innerHeight * 7.5;

const contentSVG = d3
  .select(".content")
  .append("svg")
  .attr("width", contentWidth)
  .attr("height", contentHeight);

const containerWidth = 200;
const elementEachRow = 5;

const marginTopContent = 60;

const colorCoords = {
  1: [[0, 0]],
  2: [
    [0, -12],
    [0, 12],
  ],
  3: [
    [0, -8],
    [8, 8],
    [-8, 8],
  ],
};

function createMainContent() {
  movies = movies.reverse();

  let elementRowIndex = 0;

  createAllGroups(movies);

  movies.forEach((movie, index) => {
    let elementColumnIndex = index % elementEachRow;

    let rate = movie["Rated"];

    let petalShape = petalPaths[rated.indexOf(rate)];

    let size = flowerSizeScale(+movie["imdbRating"]);
    let petalQuantitu = numPetalScale(+movie["imdbVotes"].split(",").join(""));

    let eachGroup = d3
      .select(".content-group" + index)
      .style(
        "transform",
        `translate(${
          contentWidth / 2 - (2 - elementColumnIndex) * containerWidth + 40
        }px, ${elementRowIndex * 200 + marginTopContent}px) `
      );

    let petalColors = getColors(movie);

    // draw background colors
    drawColorCircles(eachGroup, petalColors, size);

    // draw petals
    drawPetals(eachGroup, petalShape, petalQuantitu, size, movie);

    // add titles
    eachGroup
      .append("foreignObject")
      .attr("width", 200)
      .attr("height", 80)
      .attr("y", 60)
      .attr("x", -100)
      .append("xhtml:div")
      .attr("class", "title" + index);

    if (elementColumnIndex == elementEachRow - 1) {
      // add years
      eachGroup
        .append("foreignObject")
        .attr("width", 200)
        .attr("height", 80)
        .attr("x", -elementEachRow * containerWidth - 80)
        .append("xhtml:div")
        .attr("class", "year" + elementRowIndex);

      elementRowIndex += 1;
    }
  });

  drawYears();
  drawTitles();

  console.log(movies);
}

function createAllGroups(movies) {
  let group = contentSVG
    .selectAll("g")
    .data(movies)
    .enter()
    .append("g")
    .attr("class", (d, i) => "content-group" + i);
}

function drawColorCircles(group, petalColors, size) {
  for (let j = 0; j < petalColors.length; j++) {
    group
      .append("circle")
      .attr("r", size * 80)
      .attr("fill", petalColors[j])
      .style("filter", "url(#motionFilter)")
      .style("mix-blend-mode", "multiply")
      .style(
        "transform",
        `translate(${colorCoords[petalColors.length][j][0] * size * 2}px, ${
          colorCoords[petalColors.length][j][1] * size * 2
        }px) `
      );
  }
}

function drawPetals(group, petal, petalQuantitu, size, movie) {
  for (let i = 0; i < petalQuantitu; i++) {
    group
      .append("path")
      .attr("d", petal)
      .attr("stroke", "#444")
      .attr("stroke-width", "4px")
      .attr("fill", "#00000000")
      .style(
        "transform",
        `scale(${size}) rotate(${(360 / petalQuantitu) * i}deg)`
      )
      .style("cursor", "pointer")
      .on("click", () => {
        window.open("http://www.imdb.com/title/" + movie["imdbID"], "_new");
      });
  }
}
function drawYears() {
  let yearsLength = movies.length / elementEachRow;
  for (let i = 0; i < yearsLength; i++) {
    let year = movies[i * elementEachRow]["Released"].split(" ")[2];
    d3.select(".year" + i)
      .html(`<p>${year}<p>`)
      .style("text-align", "center")
      .style("font-weight", "bold")
      .style("font-size", "1.3em");
  }
}

function drawTitles() {
  movies.forEach((movie, index) => {
    d3.select(".title" + index)
      .html(`<p>${movie["Title"]}<p>`)
      .style("text-align", "center")
      .style("font-size", "0.9em");
  });
}

function getColors(movie) {
  let petalColors = [];
  let genres = movie["Genre"].split(/[, ]+/);

  genres.forEach((genre) => {
    let genreIndex = topGenres.indexOf(genre);
    let color = "";
    if (genreIndex == -1) {
      color = colors[topGenres.indexOf("Other")];
    } else {
      color = colors[genreIndex];
    }

    if (petalColors.indexOf(color) == -1) {
      petalColors.push(color);
    }
  });
  return petalColors;
}
