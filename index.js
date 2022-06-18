const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');

require('dotenv').config()

const app = express();

const port = process.env.PORT || 1234;

app.listen(port, () => console.log(`serving at port ${port}`));
app.use(express.static("public"));
app.use(express.json({
  limit: '1mb'
}))

console.log()

const weather_url = "http://api.weatherapi.com/v1/current.json";

let db = new Datastore("./datastore.db");
db.loadDatabase();

app.post('/log', async (req, res) => {
  const lat = req.body.lat;
  const lng = req.body.lng;

  let url = new URL(weather_url);
  url.searchParams.append("key", process.env.WEATHER_API_KEY);
  url.searchParams.append("q", `${lat},${lng}`);

  const resp = await fetch(url);
  const json = await resp.json();
  const cond = json.current.condition.text;
  const loc = `${json.location.country} - ${json.location.name}`;

  db.insert({
    lat: lat,
    lng: lng,
    loc,
    ts: Date.now(),
    cond,
    temp: json.current.temp_c,
  })
  res.json({
    status: "success",
    temp: json.current.temp_c,
    loc,
    cond,
  })
})

app.get('/data', async (req, res) => {
  res.json(
    db.getAllData()
  )
})
