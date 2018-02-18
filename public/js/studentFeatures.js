//functions for student features
export function addCard(Post){
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


export function getPosts(){
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
