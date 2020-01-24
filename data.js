const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
    totalVisit: 1,
    visitors: ["testUniqueVisitor"],
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
    totalVisit: 0,
    visitors: [],
  },
  // [generateRandomString()]: "https://eina.ca",
};

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "test@test.com",
    password:
      "$2b$10$ysCKgtd.BVyr61Mk9JuXU.3Jw86JnxKM3kSpD7vACi1ANtpLL6sc6",
  },
  XYcRTZ: {
    id: "XYcRTZ",
    email: "test1@test.com",
    password:
      "$2b$10$ysCKgtd.BVyr61Mk9JuXU.3Jw86JnxKM3kSpD7vACi1ANtpLL6sc6",
  },
};

// track visitors
const visitDB = {
  b6UTxQ: [{ visitorID: "testUniqueVisitor", date: "test date" }],
};

module.exports = {
  urlDatabase,
  users,
  visitDB,
};
