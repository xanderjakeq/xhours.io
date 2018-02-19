

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const firebaseApp = firebase.initializeApp(functions.config().firebase);

const database = firebase.database();

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