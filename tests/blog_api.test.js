const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "Marjan jutut",
        author: "Marja",
        url: "www.marja.fi",
        likes: 21
    },
    {
        title: "Ihkublaa",
        author: "Ihku",
        url: "www.kuinihkuu.fi",
        likes: 13
    }    
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

beforeEach(async () => {
    await Blog.remove({})
  
    const blogObjects = initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})    

describe('get blogs', () => {
    test('blogs are returned as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('right number of blogs', async () => {
        const response = await api
            .get('/api/blogs')
        
            expect(response.body.length).toBe(initialBlogs.length);
    })
})

describe('post blogs works', () => {
    test('after post number of blogs is plus one', async () => {
        const newBlog = {
            author: "Jesus",
            title: "Divine stories",
            url: "www.fromheaven.com",
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
            const blogsAtEnd = await blogsInDb()
            expect(blogsAtEnd.length).toBe(initialBlogs.length + 1)
    })

    test('posted blog is in the list of blogs', async () => {
        const newBlog = {
            author: "Jesus",
            title: "Divine stories",
            url: "www.fromheaven.com",
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            const response = await api.get('/api/blogs')
            const contents = response.body.map(r => r.title)

            expect(contents).toContainEqual('Divine stories')
    })
})

afterAll(() => {
    mongoose.connection.close()
})