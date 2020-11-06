const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert('./keys/serviceAccountKey.json'),
    databaseURL: "https://village-valet.firebaseio.com"
});

const firestore = admin.firestore();
module.exports = {firestore};

const {checkJWT, checkParameterJWT} = require("./JWToken");
const {deleteVillage, getAllVillages, getOneVillage, postVillage, putVillage} = require("./villagesController");

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

const routerDatabase = express.Router();
app.use('/api/v1/database', routerDatabase);

//Village Endpoints
routerDatabase.get('/villages/all', checkJWT, getAllVillages);
routerDatabase.get('/villages/village', checkJWT, getOneVillage);
routerDatabase.post('/villages/village', checkJWT, postVillage);
routerDatabase.put('/villages/village', checkJWT, putVillage);
routerDatabase.delete('/villages/village', checkJWT, deleteVillage);

app.listen(PORT, () => console.log('Server running on ' + PORT));
