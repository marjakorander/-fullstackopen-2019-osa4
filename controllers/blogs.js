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

blogiRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blogi.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogiRouter