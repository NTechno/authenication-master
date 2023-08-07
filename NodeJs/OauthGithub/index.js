/*  EXPRESS */
const express = require('express');
const app = express();
var passport = require("passport");
var GitHubStrategy = require('passport-github2').Strategy;


app.set('view engine', 'ejs');
var access_token = "";

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

const port = process.env.PORT || 2400;
app.listen(port , () => console.log('App listening on port ' + port));


passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});




// Import the axios library, to make HTTP requests
const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '5f731f125d74ef7d80d8'
const clientSecret = '7bf02b5b82b47b2f6607a4983100ee315279217a'

passport.use(new GitHubStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: "http://localhost:2400/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  console.log("into the stretegy github" , profile);
  // User.findOrCreate({ githubId: profile.id }, function (err, user) {
  //   return done(err, user);
  // });
}
));

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("into the github callback auth!!!!!" , res);
    access_token = res.data.access_token

    // res.redirect('/success');
  });

// // Declare the callback route
// app.get('/github/callback', (req, res) => {
//   console.log("git hub login callback");
//   // The req.query object has the query params that were sent to this route.
//   const requestToken = req.query.code
  
//   axios({
//     method: 'post',
//     url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
//     // Set the content type header, so that we get the response in JSON
//     headers: {
//          accept: 'application/json'
//     }
//   }).then((response) => {
//     access_token = response.data.access_token
//     res.redirect('/success');
//   })
// })

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});