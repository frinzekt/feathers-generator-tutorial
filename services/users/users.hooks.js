// USERS SERVICE SPECIFIC HOOKS
//  FUNCTIONS THAT CAN BE CALLED FUNCTIONS BEFORE,  AFTER, ON ERROR FOR ANY SERVICE CALL
// SERVICES EXPOSES METHODS AND HOOKS WILL RUN
// EG. BEFORE SERVICES ARE RUN HERE, MAKE SURE TO AUTHENTICATE THE PERSON FIRST
const { authenticate } = require("@feathersjs/authentication").hooks;

const {
  hashPassword,
  protect,
} = require("@feathersjs/authentication-local").hooks;

module.exports = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [hashPassword("password")],
    update: [hashPassword("password"), authenticate("jwt")],
    patch: [hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect("password"),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
