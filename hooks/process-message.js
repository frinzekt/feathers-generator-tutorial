// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async (context) => {
    const { data } = context;

    if (!data.text) {
      throw new Error("A message must have text");
      // IF ERROR IS THROWN, IT WILL STOP ALL THE INCOMING HOOKS AND WILL JUMP STRAIGHT TO THE CLIENT
      // IN SIMPLER TERMS, IT WON'T RUN THE NEXT HOOKS
    }

    // AUTHENTICATED WILL ALWAYS HAVE USER DATA ON THE PARAMS OBJECT
    const { user } = context.params;

    const text = data.text.substring(0, 400);

    //  OVERWRITING WHAT wILL BE SAVED IN THE DB
    context.data = {
      text,
      userId: user._id,
      createdAt: new Date().getTime(),
    };

    return context;
  };
};
