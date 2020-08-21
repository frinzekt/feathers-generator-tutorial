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
