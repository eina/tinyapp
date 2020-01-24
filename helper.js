const { urlDatabase } = require("./data");
/**
 * getUserByEmail: return object that has email provided
 * @param {string} email
 * @param {object} objRef
 */
const getUserByEmail = (email, objRef) => {
  for (const refId in objRef) {
    if (objRef[refId].email.toLowerCase() === email.toLowerCase()) {
      return objRef[refId];
    }
  }
};

const isLoggedIn = (sessionID, objRef) => {
  for (const refId in objRef) {
    return objRef[refId].userID === sessionID;
  }
};

/**
 * urlsForUser: returns an object of urls that belong to the userID
 * @param {string} userID
 */
const urlsForUser = userID => {
  let result = {};
  for (const refId in urlDatabase) {
    if (urlDatabase[refId].userID === userID) {
      result[refId] = { ...urlDatabase[refId] };
    }
  }
  return result;
};

module.exports = {
  getUserByEmail,
  urlsForUser,
  isLoggedIn,
};
