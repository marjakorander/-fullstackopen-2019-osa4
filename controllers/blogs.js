const blogiRouter = require('express').Router()
const Blogi = require('../models/blog')

blogiRouter.get('/', (request, response) => {
  Blogi
    .find({})
    .then(blogs => {
      if (blogs) {
        response.json(blogs)
      } else {
        response.status(404).end()
      }
    })
    .catch (error => next(error))
})

blogiRouter.post('/', (request, response, next) => {
  const body = request.body

  const blog = new Blogi({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogiRouter