const { Service } = require("feathers-nedb");

//  GRAVATAR HASHING EMAIL
const crypto = require("crypto");

const gravatarUrl = "https://s.gravatar.com/avatar";
//  size = 60
const query = "s=60";

// EXTENDS THE USER services using nedb drivers
exports.Users = class Users extends Service {
  // OVERRIDE CREATE
  //  DATa - data being sent to the server to create th user
  //  params - includes query strings
  create(data, params) {
    const { email, password, githubId } = data;

    //  You need this to get user gravatar url
    const hash = crypto
      .createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");
    const avatar = `${gravatarUrl}/${hash}?${query}`;

    const userData = {
      email,
      password,
      githubId,
      avatar,
    };

    //now the user information has been fetched, we can now use it to create user

    // we technically dont want to overwrite the entire thing, but we want to extend so we
    return super.create(userData, params);
  }
};
