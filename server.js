const express = require('express');
const app = express();
const { TextToImage } = require("deepinfra");
const { createWriteStream } = require("fs");
const { Readable } = require("stream");
const path = require('path');
const process = require('process');

const DEEPINFRA_API_KEY = "5y7xLXuvtrUNP9Vg92XwTCzVKJO0dIkT";
const MODEL = "black-forest-labs/FLUX-1-schnell";
var text = "";

const main = async (query, text) => {
  if (!(process.cwd().includes("images"))) {
    process.chdir('public/images/');
  }
  const model = new TextToImage(MODEL, DEEPINFRA_API_KEY);
  const response = await model.generate({
    prompt: query,
  });

  const result = await fetch(response.images[0]);

  if (result.ok && result.body) {
    let writer = createWriteStream(text + ".jpg");
    Readable.from(result.body).pipe(writer);
    // process.chdir("../../");
  }
};

const generateRandomText = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

function capitalizeFLetter(string) {
  return (string[0].toUpperCase() +
      string.slice(1));
}

app.set('view engine', 'ejs');
app.use(express.static("public"));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index");
});

app.post('/search', async (req, res) => {
  const query = capitalizeFLetter(String(req.body.query));
  const text = generateRandomText(10);
  await main(query, text);
  const url = `http://${req.headers.host}/images/${text}.jpg`;

  res.render("image",{url:url,query:query})
});

app.get("/test", (req, res)=>{
  res.render("image")
});

app.listen(process.env.X_ZOHO_CATALYST_LISTEN_PORT|9000, () => {
  console.log("Server Started")
})