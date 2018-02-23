// import { request } from 'http';


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');

const firebaseApp = firebase.initializeApp(functions.config().firebase);
const database = firebase.database();

const app = express();
app.engine('hbs', engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


app.get('/', (request, response)=>{
    response.set('Cache-Control', 'public, max-age=300, s-maxage=550');
    
    response.render('index');
});

app.get('/student', (request, response)=>{
    response.render('student');
});

app.get('/client', (request, response)=>{
    response.render('client');
});

app.post('/hoursRequest/:uid', (request, response,next)=>{
    var email = request.body.email;
    var hours = request.body.hours;
    var uid = request.params.uid;

    var clientRef = database.ref().child('clients');
    //get the object key of the client with the correct email and push student ID and hours requested
    var clientKey = clientRef.orderByChild('email').equalTo(email).on('child_added', snap =>{
        var key =  snap.key;
        database.ref().child('clients/' + key + '/requests').push({
            studentId: uid,
            hours: hours
        });

        console.log('success');

        response.redirect('/student');
    });
    response.render('error');
});






exports.app = functions.https.onRequest(app);



//add user to DB
exports.createUserAccount = functions.auth.user().onCreate(event => {
    const uid = event.data.uid;
    const email = event.data.email;
    const name = event.data.displayName || email.substring(0,email.indexOf('@'));
    const photoUrl = event.data.photoURL || 'some default link';

    //check if email contains "@dc.gov" for supervisors
    if( email.indexOf("@dc.gov") > -1 ){
        const newSupervisorRef = database.ref().child(`/clients/${uid}`);
        return newSupervisorRef.set({
            email: email,
            photoUrl: photoUrl,
            name: name,
            isSupervisor: true
        });

    }else{
        const newUserRef = database.ref().child(`/students/${uid}`);
        return newUserRef.set({
            email: email,
            photoUrl: photoUrl,
            name: name,
            uid: uid,
            isSupervisor: false,
            totalHours: 0,
            hours: {uid:0}
        });

    }
});
