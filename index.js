const petalPaths = [
  ["M0 0", "C50 50 50 100 0 100", "C-50 100 -50 50 0 0"],
  [
    "M-35 0",
    "C-25 25 25 25 35 0",
    "C50 25 25 75 0 100",
    "C-25 75 -50 25 -35 0",
  ],
  ["M0 0", "C50 40 50 70 20 100", "L0 85", "L-20 100", "C-50 70 -50 40 0 0"],
  ["M0 0", "C50 25 50 75 0 100", "C-50 75 -50 25 0 0"],
];

const rated = ["G", "PG", "PG-13", "R"];

const colors = ["#FFB09E", "#CBF2BD", "#AFE9FF", "#FFC8F0", "#FFF2B4"];

const votes = [1, 414, 827, 1240, 1653];
const votesTitles = ["1k imdb votes", "414k", "827k", "1,240k", "1,653k"];

const imdbRatings = ["3.7", "5.0", "6.3", "7.7", "9.0"];

let topGenres = [];

const flowerSize = 150;
const colorSize = 180;
const votesSize = 210;
const ratingSize = 270;

let movies = [];

let numPetalScale = d3.scaleQuantize().range(d3.range(5, 15, 2));
let flowerSizeScale = d3.scaleLinear().range([0.05, 0.5]);

let minVotes = 0;
let maxVotes = 0;

let minRating = 0;
let maxRating = 0;

d3.json(
  "https://raw.githubusercontent.com/sxywu/filmflowers/master/movies.json"
).then((data) => {
  for (let [movieId, movieInfo] of Object.entries(data)) {
    movies.push(movieInfo);
  }

  [minVotes, maxVotes] = d3.extent(
    movies,
    (movie) => +movie["imdbVotes"].split(",").join("")
  );

  numPetalScale.domain([minVotes, maxVotes]);

  [minRating, maxRating] = d3.extent(movies, (movie) => +movie["imdbRating"]);

  flowerSizeScale.domain([minRating, maxRating]);

  craeteLegend();

  createMainContent();
});
