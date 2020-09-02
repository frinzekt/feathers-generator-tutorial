const socket = io();

//  SOCKET INTEGRATION WITH FEATHERS
const appClient = feathers();
appClient.configure(feathers.socketio(socket));

//  USE AUTHENTICATION
appClient.configure(
  feathers.authentication({
    storage: window.localStorage,
  })
);

const login = async (credentials) => {
  //FIRST REAUTHENTICATE  CLIENT
  try {
    if (!credentials) {
      await appClient.reAuthenticate();
    } else {
      await appClient.authenticate({
        strategy: "local",
        ...credentials,
      });
    }

    // SUCCESSFUL = SHOW CHAT MESSAGES
    console.log("SUCCESSFUL LOGIN");
    showChat();
  } catch (error) {
    // THIS MEANS THAT WE ARE NOT ABLE TO REAUTHENTICATE NOR LOGIN
    showLogin(error);
  }
};

const main = async () => {
  const auth = await login();
};

main();

// Login screen
const loginHTML = `<main class="login container">
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet text-center heading">
      <h1 class="font-100">Log in or signup</h1>
    </div>
  </div>
  <div class="row">
    <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
      <form class="form">
        <fieldset>
          <input class="block" type="email" name="email" placeholder="email">
        </fieldset>

        <fieldset>
          <input class="block" type="password" name="password" placeholder="password">
        </fieldset>

        <button type="button" id="login" class="button button-primary block signup">
          Log in
        </button>

        <button type="button" id="signup" class="button button-primary block signup">
          Sign up and log in
        </button>

        <a class="button button-primary block" href="/oauth/github">
          Login with GitHub
        </a>
      </form>
    </div>
  </div>
</main>`;

// Chat base HTML (without user list and messages)
const chatHTML = `<main class="flex flex-column">
  <header class="title-bar flex flex-row flex-center">
    <div class="title-wrapper block center-element">
      <img class="logo" src="http://feathersjs.com/img/feathers-logo-wide.png"
        alt="Feathers Logo">
      <span class="title">Chat</span>
    </div>
  </header>

  <div class="flex flex-row flex-1 clear">
    <aside class="sidebar col col-3 flex flex-column flex-space-between">
      <header class="flex flex-row flex-center">
        <h4 class="font-300 text-center">
          <span class="font-600 online-count">0</span> users
        </h4>
      </header>

      <ul class="flex flex-column flex-1 list-unstyled user-list"></ul>
      <footer class="flex flex-row flex-center">
        <a href="#" id="logout" class="button button-primary">
          Sign Out
        </a>
      </footer>
    </aside>

    <div class="flex flex-column col col-9">
      <main class="chat flex flex-column flex-1 clear"></main>

      <form class="flex flex-row flex-space-between" id="send-message">
        <input type="text" name="text" class="flex flex-1">
        <button class="button-primary" type="submit">Send</button>
      </form>
    </div>
  </div>
</main>`;

const showLogin = (error) => {
  // IF LOGIN IS SHOWN AND THERE IS AN ERROR
  if (document.querySelectorAll(".login").length && error) {
    document
      .querySelector(".heading")
      .insertAdjacentHTML(
        "beforeend",
        `<p>There was an error: ${error.message}</p>`
      );
  } else {
    document.getElementById("app").innerHTML = loginHTML;
  }
};

const showChat = async () => {
  document.getElementById("app").innerHTML = chatHTML;

  const messages = await appClient.service("messages").find({
    query: {
      $sort: { createdAt: -1 },
      $limit: 50,
    },
  });

  messages.data.reverse().forEach(addMessage);
  console.log("messages: ", messages);
  const users = await appClient.service("users").find();
  console.log("users: ", users);

  users.data.forEach(addUser);
};

const addUser = (user) => {
  const userList = document.querySelector(".user-list");

  if (userList) {
    userList.innerHTML += `
      <li>
      <a href="" class="block relative">
      <img src="${user.avatar}" alt="" class="avatar"/>
      <span class="absolute username">${user.email}</span>
      </a>
      </li>
      `;

    const userCount = document.querySelectorAll(".user-list li").length;

    document.querySelector(".online-count").innerHTML = userCount;
  }
};

const addMessage = (message) => {
  const { user = {} } = message;
  const chat = document.querySelector(".chat");

  // SANITIZE CHAT MESSAGE
  const text = message.text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (chat) {
    chat.innerHTML += `<div class="message flex flex-row">
    <img src="${user.avatar}" alt="${user.email}" class="avatar"/>
    <div class="message-wrapper">
    <p class="message-header">
      <span class="username font-600">${user.email}</span>
      <span class="sent-date font-300">${moment(message.createAt).format(
        "MMM Do, hh:mm:ss"
      )}</span>
    </p>
    <p class="message-content font-300">${text}</p>
    </div>
    </div>`;

    chat.scrollTop = chat.scrollHeight - chat.clientHeight;
  }
};

const getCredentials = () => {
  const user = {
    email: document.querySelector(`[name="email"]`).value,
    password: document.querySelector(`[name="password"]`).value,
  };
  return user;
};

// WHEN THE USER CLICK THE SIGN UP THIS WILL BE HANDLED - this is just a helper functio
const addEventListener = (selector, event, handler) => {
  document.addEventListener(event, async (ev) => {
    if (ev.target.closest(selector)) {
      handler(ev);
    }
  });
};

addEventListener("#signup", "click", async () => {
  const credentials = getCredentials();

  // CREATE THE USER
  await appClient.service("users").create(credentials);
  await login(credentials);
});
addEventListener("#login", "click", async () => {
  const credentials = getCredentials();
  await login(credentials);
});

addEventListener("#logout", "click", async () => {
  await appClient.logout();
  showLogin();
});

addEventListener("#send-message", "submit", async (e) => {
  e.preventDefault();
  const input = document.querySelector('[name="text"]');

  await appClient.service("messages").create({
    text: input.value,
  });

  input.value = "";
});

// SOCKETS

appClient.service("messages").on("created", addMessage);
appClient.service("users").on("created", addUser);

login();
