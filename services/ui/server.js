require("dotenv").config()
const cron = require('node-cron');

const path = require("path")

const express = require("express")
const helmet = require("helmet")
const {urlencoded, json} = require('body-parser');
const cors = require("cors");
const app = express();


const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(urlencoded({extended: true}));
app.use(json());

// UI Routes
app.use(express.static(path.resolve('./build/')));
app.get('/*', (req, res) => res.sendFile(path.resolve('./build/index.html')));

app.listen(PORT, () => console.log('Server running on ' + PORT));
