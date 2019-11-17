const blogiRouter = require("express").Router();
const Blogi = require("../models/blog");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const getTokenFrom = request => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

blogiRouter.get("/", async (request, response) => {
  const blogs = await Blogi.find({}).populate("user", { username: 1, name: 1 });
  if (blogs) {
    response.json(blogs.map(blog => blog.toJSON()));
  } else {
    response.status(404).end();
  }
});

blogiRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const token = getTokenFrom(request);

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: "token missing or invalid" });
    }

    const user = await User.findById(decodedToken.id);

    const blog = new Blogi({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.json(savedBlog.toJSON());
  } catch (error) {
    next(error);
  }
});

blogiRouter.delete("/:id", async (request, response, next) => {
  try {
    await Blogi.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = blogiRouter;
