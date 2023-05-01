const { assert } = require("chai");
const { ObjectID } = require("mongodb");
const { createUser, editNickname, getUserById } = require("../data/users");
const { users } = require("../config/mongoCollections");

describe("editNickname function", function () {
  before(async function () {
    this.timeout(10000);
    await users().drop();
  });

  afterEach(async function () {
    this.timeout(10000);
    await users().deleteMany({});
  });

  it("should update the nickname of the user", async function () {
    this.timeout(10000);

    const newUser = await createUser(
      "testuser",
      "testpassword",
      "testnickname"
    );

    const updatedUser = await editNickname(
      newUser._id.toString(),
      "newnickname"
    );
    assert.equal(updatedUser.nickname, "newnickname");

    const userFromDb = await getUserById(newUser._id.toString());
    assert.equal(userFromDb.nickname, "newnickname");
  });

  it("should throw an error if the user ID is not provided", async function () {
    this.timeout(10000);

    try {
      await editNickname(undefined, "newnickname");
      assert.fail("Expected error not thrown");
    } catch (error) {
      assert.equal(error, "Error: User ID not provided");
    }
  });

  it("should throw an error if the nickname is not provided", async function () {
    this.timeout(10000);

    const newUser = await createUser(
      "testuser",
      "testpassword",
      "testnickname"
    );

    try {
      await editNickname(newUser._id.toString(), undefined);
      assert.fail("Expected error not thrown");
    } catch (error) {
      assert.equal(error, "Error: Display name not provided");
    }
  });

  it("should throw an error if the nickname already exists", async function () {
    this.timeout(10000);

    await createUser("testuser1", "testpassword", "testnickname");
    const newUser = await createUser(
      "testuser2",
      "testpassword",
      "newnickname"
    );

    try {
      await editNickname(newUser._id.toString(), "testnickname");
      assert.fail("Expected error not thrown");
    } catch (error) {
      assert.equal(error, "Error: Display name exists");
    }
  });
});
