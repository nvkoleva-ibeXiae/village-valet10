const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert('./keys/serviceAccountKey.json'),
    databaseURL: "https://village-valet.firebaseio.com"
});

const firestore = admin.firestore();
module.exports = {firestore};

const {checkJWT, checkParameterJWT} = require("./JWToken");
const {deleteUser, getAllUsers, getOneUser, patchUser_active, patchUser_vetting, postUser, putUser} = require("./usersController");

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

//User Endpoints
routerDatabase.get('/users/all', checkJWT, getAllUsers);
routerDatabase.get('/users/user', checkJWT, getOneUser);
routerDatabase.post('/users/user', checkJWT, postUser);
routerDatabase.patch('/users/user/vetting', checkJWT, patchUser_vetting);
routerDatabase.patch('/users/user/status', checkJWT, patchUser_active);
routerDatabase.put('/users/user', checkJWT, putUser);
routerDatabase.delete('/users/user', checkJWT, deleteUser);

app.listen(PORT, () => console.log('Server running on ' + PORT));
