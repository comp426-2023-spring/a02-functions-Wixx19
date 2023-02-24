#!/usr/bin/env node

// Imports
import moment from "moment-timezone";
import minimist from "minimist";
import fetch from "node-fetch";

var argc = minimist(process.argv.slice(2));

if(argc.h){
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`);
    process.exit(0); 
}


// timezone
const timezone = moment.tz.guess(); 

// what we want it to look like
// {"latitude":35.875,"longitude":-79.0,"generationtime_ms":0.44608116149902344,"utc_offset_seconds":-14400,"timezone":"America/New_York","timezone_abbreviation":"EDT","elevation":127.0,"current_weather":{"temperature":66.7,"windspeed":2.9,"winddirection":212.0,"weathercode":0.0,"time":"2022-09-22T06:00"},"daily_units":{"time":"iso8601","precipitation_hours":"h"},"daily":{"time":["2022-09-22","2022-09-23","2022-09-24","2022-09-25","2022-09-26","2022-09-27","2022-09-28"],"precipitation_hours":[0.0,0.0,0.0,3.0,3.0,0.0,0.0]}}

// latitude and longitude
let latitude = argc.n || argc.s * -1;
let longitude = argc.e || argc.w * -1; 

// Make a request
const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours");
// Get the data from the request
const data = await response.json();

if (argc.j){
  console.log(data);
  process.exit(0);
}

const days = argc.d 
const rain = data.daily.precipitation_hours[days];

if (rain > 0){
  process.stdout.write("You mighe need your galoshes ");
} else {
  process.stdout.write("You will not need your galoshes ");
}


if (days == 0) {
  console.log("today.")
} else if (days > 1) {
  console.log("in " + days + " days.")
} else {
  console.log("tomorrow.")
}


