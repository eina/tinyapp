const { assert } = require("chai");

const { getUserByEmail, urlsForUser } = require("../helper");
const { urlDatabase } = require("../data");

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

describe("getUsersByEmail", () => {
  it("should return a user with valid email", () => {
    const user = getUserByEmail("user@example.com", users);
    const expectedOutput = "userRandomID";

    assert.strictEqual(user.id, expectedOutput);
  });

  it("should return a user with valid email in all caps", () => {
    const user = getUserByEmail("USER@EXAMPLE.COM", users);
    const expectedOutput = "userRandomID";

    assert.strictEqual(user.id, expectedOutput);
  });

  it("should return undefined when given an email not in users database", () => {
    const user = getUserByEmail("test@test.com", users);

    assert.strictEqual(user, undefined);
  });
});

describe("urlsForUser", () => {
  it("should return an object with URLS if given a valid ID", () => {
    const result = urlsForUser("aJ48lW");

    assert.deepInclude(urlDatabase, result);
  });
  it("should return an empty object if given an ID that doesn't exist", () => {
    const result = urlsForUser("user2RandomID");

    assert.deepInclude({}, result);
  });
});
