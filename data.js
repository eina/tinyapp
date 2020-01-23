const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  // [generateRandomString()]: "https://eina.ca",
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "test@test.com",
    password:
      "$2b$10$ysCKgtd.BVyr61Mk9JuXU.3Jw86JnxKM3kSpD7vACi1ANtpLL6sc6",
    // password: bcrypt.hashSync("123456789", 10),
  },
  XYcRTZ: {
    id: "XYcRTZ",
    email: "test1@test.com",
    password:
      "$2b$10$ysCKgtd.BVyr61Mk9JuXU.3Jw86JnxKM3kSpD7vACi1ANtpLL6sc6",
  },
};

module.exports = {
  urlDatabase,
  users,
};
