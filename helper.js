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

module.exports = {
  getUserByEmail,
};
