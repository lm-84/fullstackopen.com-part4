const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog identified by id property', async () => {
  //await api.get('/api/blogs').expect(200).expect(Response.id.toBeDefined())
  //console.log('Response.id: ', Response.id)
  const response = await api.get('/api/blogs')
  console.log('response.body: ', response.body)
  response.body.forEach((element) => {
    expect(element.id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
