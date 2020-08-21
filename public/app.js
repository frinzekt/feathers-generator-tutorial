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

const login = async () => {
  //FIRST REAUTHENTICATE  CLIENT
  try {
    return await appClient.reAuthenticate();
  } catch (error) {
    //  NO STORED TOKEN
    return await appClient.authenticate({
      strategy: "local",
      email: "heallo@feathersjs.com",
      password: "secret",
    }); // THIS IS HARD CODED ATM, CHANGE IT
  }
};

const main = async () => {
  const auth = await login();

  console.log("User is authenicatedt: ", auth);

  // logout
  await appClient.logout();
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

const showLogin = () => {
  document.getElementById("app").innerHTML = loginHTML;
};

showLogin();
