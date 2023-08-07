/*  EXPRESS */
const express = require("express");
const app = express();
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
	session({
		resave: false,
		saveUninitialized: true,
		secret: "SECRET",
	})
);

app.get("/", function (req, res) {
	res.render("pages/auth");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("App listening on port " + port));

var passport = require("passport");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get("/success", (req, res) => {
	res.render("pages/success", { user: userProfile });
});
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
	cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

/*  Google AUTH  */

var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
	"147737003183-6vsu446gtiu1lt9ru4adulaeh2hi1pj9.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
	new GoogleStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:5000/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			console.log("into google stretegy!!");
			userProfile = profile;
			return done(null, userProfile);
		}
	)
);

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/error" }),
	function (req, res) {
		// Successful authentication, redirect success.
		res.redirect("/success");
	}
);
