const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const listWithOneBlog = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog identified by id property', async () => {
  const response = await api.get('/api/blogs')
  console.log('response.body: ', response.body)
  response.body.forEach((element) => {
    expect(element.id).toBeDefined()
  })
})

describe('addition of a new blog', () => {
  test('number of blogs incremented by one', async () => {
    const previousResponse = await api.get('/api/blogs')
    const previousLength = previousResponse.body.length
    const newBlog = listWithOneBlog[0]
    await api.post('/api/blogs').send(newBlog).expect(201)
    const response = await api.get('/api/blogs')
    expect(response.body.length).toBe(previousLength + 1)
  })
  test('blog added to database', async () => {
    const newBlog = listWithOneBlog[0]
    await api.post('/api/blogs').send(newBlog).expect(201)
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach((element) => {
      delete element.id
    })
    delete newBlog.id
    expect(blogs).toContainEqual(newBlog)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
