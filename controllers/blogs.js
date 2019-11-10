const blogiRouter = require('express').Router()
const Blogi = require('../models/blog')

blogiRouter.get('/', async (request, response) => {
  const blogs = await Blogi.find({})
  if (blogs) {
    response.json(blogs.map(blog => blog.toJSON()))
  } else {
    response.status(404).end()
  }
})

blogiRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blogi({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })
  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(error) {
    next(error)
  }  
})

module.exports = blogiRouter