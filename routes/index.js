const express = require('express');
const router = express.Router();
const request = require('request');
require('dotenv').config()

const apiKey = process.env.PASSWORD;
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

const imageBaseUrl = 'http://image.tmdb.org/t/p/w500';  

router.use((req,res,next)=>{
  res.locals.imageBaseUrl = imageBaseUrl;
  next()
})

router.get('/', function(req, res, next) {
  request.get(nowPlayingUrl,(error,response, movieData)=>{
    const parsedData = JSON.parse(movieData)
    res.render('index', {
      parsedData: parsedData.results,
    })
  })
});

router.get('/movie/:id',(req,res,next)=>{
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`
  request.get(thisMovieUrl,(error,response,movieData)=>{
    const parsedData = JSON.parse(movieData)
    res.render('single-movie',{
      parsedData
    })
  })
})

router.post('/search',(req,res,next) =>{
  const userSearchTerm = req.body.movieSearch;
  const category = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${category}?query=${userSearchTerm}&api_key=${apiKey}`;
  request.get(movieUrl, (error, response, movieData) =>{
    let parsedData = JSON.parse(movieData)
    if (userSearchTerm === ''){
      res.response({
        message: "Entry field can not be empty"
      })
    }
    if (category == "person"){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    })
  })
}) 

module.exports = router;
