// import {getPosts} from 'studentFeatures';

(function(){
  // Firebase config.
  var config = {
    apiKey: "AIzaSyBLvkO_98iBy9LRMpKRDPypGJxC2agD5VA",
    authDomain: "xhours1.firebaseapp.com",
    databaseURL: "https://xhours1.firebaseio.com",
    projectId: "xhours1",
    storageBucket: "xhours1.appspot.com",
    messagingSenderId: "333435455801"
  };
  firebase.initializeApp(config);

// start Sign in and out --------------------------------------------------------------

  logIn.addEventListener('click', e =>{
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user.uid);
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  });

  logOut.addEventListener('click', e =>{
    firebase.auth().signOut();
    window.location.replace("../index.html");
  });

//end Sign in and out ---------------------------------------------------------------------
  var database = firebase.database();



  function addCard(Post){
    var ul = document.getElementById('postList');
    var card = document.createElement('li');
    var title = document.createElement('h3');
    var body = document.createElement('p');
    var contact = document.createElement('a');

    var bodycontent = document.createTextNode(Post.body);
    var titlecontent = document.createTextNode(Post.title);
    var contactcontent = document.createTextNode(Post.contact);

    console.log(bodycontent);
    body.appendChild(bodycontent);
    title.appendChild(titlecontent);
    contact.appendChild(contactcontent);

    card.appendChild(title);
    card.appendChild(body);
    card.appendChild(contact);
    card.className = 'listCard';
    ul.appendChild(card);


  }

  //get opportunity posts
  function getPosts(){
    var postsRef = database.ref().child('Posts');
    postsRef.once('value', snapshot =>{
        var posts = snapshot.val();
        console.log(posts);
        var keys = Object.keys(posts);

        for(var i = 0; i < keys.length; i ++){
            key = keys[i];
            //console.log(posts[key].Author);
            addCard(posts[key]);
        }
    });
  }

  function request(){
    var reqDiv = document.createElement('div');
    var form = document.createElement('form');
    var email = document.createElement('input');
    var hours = document.createElement('input');
    var submit = document.createElement('button');

    email.setAttribute('type', 'email');
    hours.setAttribute('type', 'number');
    submit.setAttribute('type', 'submit');
    submit.className = 'button-primary';
    submit.id = 'submitHoursRequest';
    submit.innerText = 'Submit';
    reqDiv.id = 'requestForm';
    form.id = 'requestFormInput';

    form.appendChild(email);
    form.appendChild(hours);
    form.appendChild(submit);
    reqDiv.appendChild(form);
    document.body.appendChild(reqDiv);




  }



  firebase.auth().onAuthStateChanged(user =>{
    if(user){
      const uid = user.uid;
      var studentRef = database.ref().child('students/' + uid);
      studentRef.on('value', snapshot =>{
        var data = snapshot.val();
        console.log(data.totalHours);
      });



      //show the logout btn, hide the login btn and show the hours of current user
      document.getElementById("logOut").style.display= "block";
      document.getElementById("logIn").style.display= "none";
      document.getElementById("hours").style.display= "block";

      //create the plus button
      //TODO: move this to somewhere else
      var container = document.getElementById('container');
      var plusbtn = document.createElement('button');
      plusbtn.id = "plusbtn";
      plusbtn.className = "button-primary";
      plusbtn.innerText = "Request";
      container.appendChild(plusbtn);
      //end adding plusbtn

      request();

      plusbtn.addEventListener('click', e =>{
        document.getElementById('requestForm').style.display = "block";
        document.getElementById('requestFormInput').style.display = "block";

      });


      submitHoursRequest.addEventListener('click', function(){
        console.log("what is going onn bro");
        let clientRef = database.ref().child('clients');
          clientRef.orderByChild('email').equalTo('gov@dc.gov').on('child_added', snap =>{
            var d = snap.key;
            console.log(d);
          });
      });

      

      var hours = database.ref().child('students/' + user.uid +'/totalHours');
      hours.on('value', snapshot => {
              //snapshot is a snapshot of the values of the ref snapshot.val() to access the values
              var totalhours = snapshot.val();
              console.log( snapshot.val());
              document.getElementById("hours").innerText = totalhours;
            });
    //remove default card then add Posts
    var defaultCard = document.getElementById('defaultCard');
    document.getElementById('postList').removeChild(defaultCard);

    //add opportunity list cards
    getPosts();



    }else{
      //document.getElementById("hours").style.display= "none";
    }
  });

}());
