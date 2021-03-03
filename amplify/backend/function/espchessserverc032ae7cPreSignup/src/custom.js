exports.handler = (event, context, callback) => {

  const regex = /^[a-z]+$/g;
  if (!event.userName.match(regex)) {
    throw "Username can not contain special characters"
  }
  // insert code to be executed by your lambda trigger
  callback(null, event);
};
