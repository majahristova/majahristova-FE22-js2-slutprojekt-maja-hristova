const url = `https://socialmedia-588f1-default-rtdb.europe-west1.firebasedatabase.app/`;
const baseurl = url + 'userdata.json';

const NameInputbox = document.querySelector<HTMLInputElement>('#typeInUserName');
const passwordInputbox = document.querySelector<HTMLInputElement>('#typeInPassWord');
const logInBtn = document.querySelector<HTMLButtonElement>('#logInButton');
const createAccountBtn = document.querySelector<HTMLButtonElement>('#createAccountButton');
const registerDoneBtn = document.querySelector<HTMLButtonElement>('#registerAccountButton');
const avatarInputs = document.querySelectorAll<HTMLInputElement>('input.avatar');
const chooseProfileImageSection = document.querySelector<HTMLBodyElement>('#image-section')

// Style to some buttons
registerDoneBtn.style.display = 'none';
chooseProfileImageSection.style.display = 'none'

// Choosing to create a new account
createAccountBtn.addEventListener('click', (event: MouseEvent) => {
    event.preventDefault();
    registerDoneBtn.style.display = 'block';
    logInBtn.style.display = 'none';
    createAccountBtn.style.display = 'none';
    chooseProfileImageSection.style.display = 'block';
});

// Choosing Image for new account
const pickAvatar: string[] = [];

avatarInputs.forEach((avatar: HTMLInputElement) => {
    avatar.addEventListener('click', () => {
        pickAvatar.shift();
        pickAvatar.push(avatar.value);
    });
});

// Posting a new user account info to Firebase
registerDoneBtn.addEventListener('click', createAccountFunc);
async function createAccountFunc(event: MouseEvent) {
    event.preventDefault();
    const userNameInput = NameInputbox.value;
    const passWordInput = passwordInputbox.value;

    const newAccount = {
        username: userNameInput,
        password: passWordInput,
        img: pickAvatar[0]
    };

    const init = {
        method: 'POST',
        body: JSON.stringify(newAccount),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    };

    const responePost = await fetch(baseurl, init);
    const dataFromPost = await responePost.json();
    setTimeout(() => {
        alert('Welcome')
        location.href = "/index.html";
       }, 5000);
 
}

// Checks if account exists
logInBtn.addEventListener('click', logInVerification);
async function logInVerification(event: MouseEvent) {
    event.preventDefault();

    try {
        const response = await fetch(baseurl);
        const data = await response.json();
        verifyinProcess(data);
    } catch (error) {
        console.log(error);
    }
}

// Verifying if the user exists and save to local storage with id
function verifyinProcess(data: Record<string, any>) {
    const keysFromData = Object.keys(data);
    const listFromData = Object.values(data);
    const userNameInput = NameInputbox.value;
    const passWordInput = passwordInputbox.value;
    console.log(typeof userNameInput, typeof passWordInput);

    let userFound = false;

    for (let i = 0; i < listFromData.length; i++) {
        if (userNameInput == listFromData[i].username && passWordInput == listFromData[i].password) {
            const userData = { ...listFromData[i], id: keysFromData[i] };
            console.log(userData);
            localStorage.setItem('currentUser', JSON.stringify(userData));
            location.href = "/userpage.html";
            userFound = true;
        }
    }

    if (!userFound) {
        alert('user not found');
    }
}
