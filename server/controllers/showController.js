import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

//TMDB AXIOS INSTANCE
const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 8000,
  headers: {
    Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
    Accept: "application/json",
  },
});

const nowPlayingCache = {
  data: null,
  lastFetched: 0,
};

// API to get now playing movies from TMDB API
export const getNowPlayingMovies = async (req, res) => {
  try {
    const now = Date.now();

    // cache for 10 minutes
    if (nowPlayingCache?.data) {
      return res.json({
        success: true,
        movies: nowPlayingCache.data,
      });
    }

    const { data } = await tmdb.get("/movie/now_playing", {
      params: {
        region: "IN",
        language: "en-US",
      },
    });

    const sortedMovies = data.results.sort(
      (a, b) => b.popularity - a.popularity
    );

    nowPlayingCache.data = sortedMovies;
    nowPlayingCache.lastFetched = now;

    res.json({ success: true, movies: sortedMovies });
  } catch (err) {
    console.error("TMDB ECONNRESET:", err.code);
    res.status(503).json({
      success: false,
      message: err.message,
    });
  }
};

// API to add a new show to the database
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findOne({ _id: String(movieId) });

    if (!movie) {
      let movieDetailsResponse;
      let movieCreditsResponse;
      try {
        movieDetailsResponse = await tmdb.get(`/movie/${movieId}`);
        movieCreditsResponse = await tmdb.get(`/movie/${movieId}/credits`);
      } catch (tmdbError) {
        console.error(
          "TMDB fetch failed:",
          tmdbError.code || tmdbError.message
        );
        return res.status(503).json({
          success: false,
          message: "Unable to fetch movie details. Please try again.",
        });
      }

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Shows added successfully" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

// API to get all shows from the database
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filter unique shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get a single show from the database
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    // get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, movie, dateTime });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};
