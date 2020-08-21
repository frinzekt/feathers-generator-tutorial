// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { app, method, result, param } = context;

    // ATTACHING USER IN MESSAGE
    const addUser = async (message) => {
      const user = await app.service("users").get(messsage.userId, params);
      return {
        ...message,
        user,
      };
    };

    // WILL NEED TO CHANGE ALL IF THERE ARE MULTIPLE MESSAGES
    if (method === "find") {
      result.data = await Promise.all(result.data.map(addUser));
    } else {
      //  one message: get, create, update
      context.result = await addUser(result);
    }

    return context;
  };
};
