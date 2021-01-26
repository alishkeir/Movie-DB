const express = require("express");

const app = express();

var port = process.env.port || 5000;

var date = new Date();

var time = date.getHours() + ":" + date.getSeconds();

app.listen(port, () => console.log(`Server started at port: ${port}`));

app.get("/", (req, res) => res.send("ok"));

app.get("/test", (req, res) => res.send({
  status: 200,
  message: "ok"
}));

app.get("/time", (req, res) => res.send({
  status: 200,
  message: time
}));

app.get("/hello/:id", (req, res) =>
  res.send({
    status: 200,
    message: `Hello, ${req.params.id}`
  })
);

app.get("/search", (req, res) => {
  var search = req.query.s;
  if (typeof search == "undefined") {
    res.status(500).send({
      status: 500,
      error: true,
      message: "you have to povide a search",
    });
  } else {
    res.status(200).send({
      status: 200,
      message: "ok",
      data: search
    });
  }
});

const movies = [{
    title: "Jaws",
    year: 1975,
    rating: 8
  },
  {
    title: "Avatar",
    year: 2009,
    rating: 7.8
  },
  {
    title: "Brazil",
    year: 1985,
    rating: 8
  },
  {
    title: "الإرهاب والكباب‎",
    year: 1992,
    rating: 6.2
  },
];

app.get("/movies/read", (req, res) => res.send({
  status: 200,
  data: movies
}));

app.get("/movies/read/by-date", (req, res) =>
  res.send({
    data: movies.sort((f, s) => {
      return f.year - s.year;
    }),
  })
);

app.get("/movies/read/by-rating", (req, res) =>
  res.send({
    data: movies.sort((f, s) => {
      return s.rating - f.rating;
    }),
  })
);

app.get("/movies/read/by-title", (req, res) =>
  res.send({
    data: movies.sort((f, s) => {
      return f.title.localeCompare(s.title);
    }),
  })
);
app.get("/movies/read/id/:id", (req, res) => {
  var id = req.params.id;
  if (id <= movies.length && id > 0) {
    res.send({
      status: 200,
      data: movies[id - 1]
    });
  } else {
    res.send({
      status: 404,
      error: true,
      message: `The Movie ${id} dpes not exists`,
    });
  }
});

app.post("/movies/add", (req, res) => {
  const title = req.query.title;
  const year = req.query.year;
  const rating = req.query.rating;

  if (
    title == null ||
    isNaN(year) ||
    typeof year === "undefined" ||
    year.toString().length != 4
  ) {
    res.send({
      status: 403,
      error: true,
      message: "you cannot create a movie without providing a title and a year",
    });
  } else if (rating == "" || typeof rating === "undefined") {
    var lenght = 4;

    movies.push({
      title: title,
      year: year,
      rating: length,
    });
    res.send(movies);
  } else {
    movies.push({
      title: title,
      year: year,
      rating: rating,
    });
    res.send({
      status: 200,
      data: movies,
    });
  }
});

app.delete("/movies/delete/:id", (req, res) => {
  let filmId = req.params.id;
  if (filmId >= movies.length || filmId < 0) {
    res.send({
      status: 404,
      error: true,
      message: `the movie id ${filmId} does not exist `,
    });
  } else {
    let films = movies;
    films.splice(filmId, 1);
    res.send(films);
  }
});

app.put("/movies/update/:id", (req, res) => {
  var movieID = req.params.id;
  var movieTitle = req.query.title;
  var movieYear = req.query.year;
  var movieRating = req.query.rating;
  if (movieID < 0 || movieID >= movies.length) {
    res.send("Invalid Movie id");
  }

  if (movieTitle != null) {
    movies[movieID].title = movieTitle;
  }

  if (movieYear != null) {
    movies[movieID].year = movieYear;
  }

  if (movieRating != null) {
    movies[movieID].rating = movieRating;
  }

  res.send(movies);
});