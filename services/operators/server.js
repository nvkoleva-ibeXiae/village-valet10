const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert('./keys/serviceAccountKey.json'),
    databaseURL: "https://village-valet.firebaseio.com"
});

const firestore = admin.firestore();
module.exports = {firestore};

const {checkJWT, checkParameterJWT} = require("./JWToken");
const {
    deleteOperator,
    getAllOperators,
    getOneOperator,
    getSelfOperator,
    login,
    postOperator,
    putOperator
} = require("./operatorController");

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

//Operator Endpoints
routerDatabase.get('/operators/all', checkJWT, getAllOperators);
routerDatabase.get('/operators/operator', checkJWT, getOneOperator);
routerDatabase.get('/operators/self', checkJWT, getSelfOperator);
routerDatabase.post('/operators/operator', checkJWT, postOperator);
routerDatabase.put('/operators/operator', checkJWT, putOperator);
routerDatabase.delete('/operators/operator', checkJWT, deleteOperator);

app.listen(PORT, () => console.log('Server running on ' + PORT));
