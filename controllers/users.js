const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/users");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1});
  if (users) {
    response.json(users.map(user => user.toJSON()));
  } else {
    response.status(404).end();
  }
});

usersRouter.post("/", async (request, response, next) => {
  try {
    const body = request.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash: passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
  } catch (exception) {
    next(exception);
  }
});

module.exports = usersRouter;
