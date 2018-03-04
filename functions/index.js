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

app.post('/hoursRequest/:uid/:name', (request, response,next)=>{
    var email = request.body.email;
    var hours = request.body.hours;
    var uid = request.params.uid;
    var name = request.params.name;

    var exists = false;

    var clientRef = database.ref().child('users');
    //get the object key of the client with the correct email and push student ID and hours requested
    var clientKey = clientRef.orderByChild('email').equalTo(email).on('child_added', snap =>{
        var key =  snap.key;
        exists = true;
        database.ref().child('users/' + key + '/requests').push({
            studentId: uid,
            hours: hours,
            name: name
        });

        console.log('success');

        response.redirect('/student');
    });
    if(exists){
        //TODO: add get path '/error'
        response.render('error');
    }
});

app.post('/post/:uid', (request, response,next)=>{
    var title = request.body.title;
    var detail = request.body.detail;
    var uid = request.params.uid;

    var exists = false;

    var postsRef = database.ref().child('Posts');
    
    postsRef.push({
        title: title,
        body: detail,
        author: uid
    });
    response.redirect('/client');
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
        const newSupervisorRef = database.ref().child(`/users/${uid}`);
        return newSupervisorRef.set({
            email: email,
            photoUrl: photoUrl,
            name: name,
            isSupervisor: true
        });

    }else{
        const newUserRef = database.ref().child(`/users/${uid}`);
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

// exports.updateTotalHours = function(){
//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//             var uid = user.uid;
//           // User is signed in.
//             var userRef = database.ref().child('users/' + uid);
//             userRef.once('value', snap =>{
//                 var data = snap.val();
//                 if(!data.isSupervisor){
//                     var hoursRef = userRef.child('hours');
//                     var totalHoursRef = userRef.child('totalHours');
//                     hoursRef.on('child_added', data =>{

//                         var hours = data.val();
//                         var keys = Object.keys(hours);
//                         var total = 0;
//                         for(var i = 0; i < keys.length; i ++){
//                             var key = keys[i];
//                             total += hours[key];
//                         }
//                         console.log("hmm" + total);
//                         totalHours.set(total);
//                     });
//                 }
//             });
            
//         } else {
//           // No user is signed in.
//         }
//       });
      
// }