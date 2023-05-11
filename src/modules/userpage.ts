// import index from './index.htlm'

const newPostBtn = document.querySelector<HTMLButtonElement>('#postMessageButton');
const welcomeMessage = document.querySelector<HTMLHeadingElement>('h1');
const newpostInput = document.querySelector<HTMLInputElement>('#messageInputBox');
const deleteAccountBtn = document.querySelector<HTMLButtonElement>('#deleteAcc');
const currentUser = JSON.parse(localStorage.getItem('currentUser')!) as {id: string, username: string, img: string, posts?: string[]};

const url = ` https://socialmedia-588f1-default-rtdb.europe-west1.firebasedatabase.app/`;
const newUrl = `${url}userdata/${currentUser.id}.json`;
const baseurl = `${url}userdata.json`;

//Displays userinformation through localstorage
function userpageShowPersonalInfo(currentUser: {username: string, img: string}) {
  welcomeMessage.innerText = `Welcome ${currentUser.username}`;

  const profileImage = document.createElement('img');
  document.body.appendChild(profileImage)
  profileImage.src = currentUser.img;
}
userpageShowPersonalInfo(currentUser);

//Displalys automatic the post that has been created before
async function fetchData() {
  const response = await fetch(newUrl);
  const data = await response.json() as {posts?: string[]};
  if (data) {
    displaymessage(data);
  }
}
fetchData();

//Posts new messages
newPostBtn.addEventListener('click', updateCurrentUser);
async function updateCurrentUser(event: MouseEvent){
  event.preventDefault();
  const writemessage = newpostInput.value;
  console.log(writemessage);

  const response = await fetch(newUrl);
  const userData = await response.json() as {posts?: string[]};

  // Add the new post to the `posts` array in the user data
  if (userData.posts) {
    userData.posts.push(writemessage);
  } else {
    userData.posts = [writemessage];
  }
  const init = {
    method: 'PATCH',
    body: JSON.stringify(userData),
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    }
  };
  const responePost = await fetch(newUrl, init);
  const dataFromPost = await responePost.json() as {posts?: string[]};
  console.log(dataFromPost);
  displaymessage(dataFromPost);
}


//Displaying the posts
function displaymessage(userData: {posts?: string[]}) {
  const posts = userData.posts ?? [];
  const container = document.getElementById('post-container'); // replace with your container element ID
  container!.innerHTML = ''; // clear existing posts from container
  for (let i = 0; i < posts.length; i++) {
    const textbubble = document.createElement('h4');
    container!.appendChild(textbubble);
    textbubble.innerText = posts[i];
  }
}

//Deleting the account
deleteAccountBtn.addEventListener('click',()=>{
  let init = {
    method : 'DELETE'
  };

  fetch(newUrl,init)
  .then(response => console.log(response.status))
  .then (setTimeout(() => {
   alert('Hope to see you here soon again')
   localStorage.clear();
   window.location.assign('index.html');
  }, 5000));
});

//Able to see other people post 
async function fetchingAlldata(){
  const response = await fetch(baseurl);
  const showDataFromProfile = await response.json() as Record<string, {username: string, img: string, posts?: string[]}>;
  showOtherProfiles(showDataFromProfile);
  console.log(showDataFromProfile);
}
fetchingAlldata();


function showOtherProfiles(showDataFromProfile: any) {
  const objectFromUsernameData = Object.values(showDataFromProfile);

  for (let i = 0; i < objectFromUsernameData.length; i++) {
    const usernameProfile = document.createElement('p');
    document.body.appendChild(usernameProfile);
    usernameProfile.innerText = objectFromUsernameData[i].username;

    usernameProfile.addEventListener('click', () => {
      const modal = document.getElementById('myModal')!;
      const modalContainer = document.getElementById('modal-container')!;

      // Clear existing content from modal
      modalContainer.innerHTML = '';

      // Add username to modal
      const usernameElement = document.createElement('h3');
      usernameElement.innerText = 'User ' + objectFromUsernameData[i].username;
      modalContainer.appendChild(usernameElement);
      
      const usernameElementProfilepic = document.createElement('img');
      modalContainer.appendChild(usernameElementProfilepic)
      usernameElementProfilepic.src = objectFromUsernameData[i].img
      
      // Get the latest post (the last element in the posts array)
      const latestPost = objectFromUsernameData[i].posts[objectFromUsernameData[i].posts.length - 1];

      // Add latest post to modal
      const postElement = document.createElement('h4');
      postElement.innerText =  "Latest post =  " + latestPost;
      modalContainer.appendChild(postElement);

      // Open the modal
      modal.style.display = "block";
    });
  }

  // Close the modal when the user clicks on the close button
  const closeButton = document.getElementsByClassName("close")[0] as HTMLSpanElement;
  closeButton.onclick = function() {
    const modal = document.getElementById('myModal')!;
    modal.style.display = "none";
  }
}






