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

const listWithOneBlogWithoutLikes = [
  {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  },
]

const listWithOneBlogToFail = [
  {
    id: '5a422aa71b54a676234d17f8',
    author: 'Edsger W. Dijkstra',
    likes: 8,
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
  test('blog without likes added to database with likes set to 0', async () => {
    const newBlog = listWithOneBlogWithoutLikes[0]
    await api.post('/api/blogs').send(newBlog).expect(201)
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach((element) => {
      delete element.id
    })
    delete newBlog.id
    expect(blogs).toContainEqual({ ...newBlog, likes: 0 })
  })
  test('blog without title and url not added to database', async () => {
    const newBlog = listWithOneBlogToFail[0]
    await api.post('/api/blogs').send(newBlog).expect(400)
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach((element) => {
      delete element.id
    })
    delete newBlog.id
    expect(blogs).not.toContainEqual(newBlog)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[response.body.length - 1].id
    await api.delete(`/api/blogs/${id}`).expect(204)
  })
  test('fails with status code 400 if id is invalid', async () => {
    await api.delete('/api/blogs/1234').expect(400)
  })
  test('number of blogs decreased', async () => {
    const response = await api.get('/api/blogs')
    const previousLength = response.body.length
    const id = response.body[response.body.length - 1].id
    await api.delete(`/api/blogs/${id}`)
    const newResponse = await api.get('/api/blogs')
    expect(newResponse.body.length).toBe(previousLength - 1)
  })
  test('blog deleted from database', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[response.body.length - 1].id
    await api.delete(`/api/blogs/${id}`)
    const newResponse = await api.get('/api/blogs')
    const blogs = newResponse.body
    blogs.forEach((element) => {
      delete element.id
    })
    expect(blogs).not.toContainEqual(response.body[response.body.length - 1])
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[response.body.length - 1].id
    await api.put(`/api/blogs/${id}`).expect(200)
  })
  test('fails with status code 400 if id is invalid', async () => {
    await api.put('/api/blogs/1234').expect(400)
  })
  test('number of blogs unchanged', async () => {
    const response = await api.get('/api/blogs')
    const previousLength = response.body.length
    const id = response.body[response.body.length - 1].id
    await api.put(`/api/blogs/${id}`)
    const newResponse = await api.get('/api/blogs')
    expect(newResponse.body.length).toBe(previousLength)
  })
  test('blog updated in database', async () => {
    const response = await api.get('/api/blogs')
    const id = response.body[response.body.length - 1].id
    const newBlog = { ...response.body[response.body.length - 1], likes: 10 }
    await api.put(`/api/blogs/${id}`).send(newBlog)
    const newResponse = await api.get('/api/blogs')
    const blogs = newResponse.body
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
