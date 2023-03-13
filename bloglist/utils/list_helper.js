var lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let maxLikes = 0
  let favoriteBlog = {}
  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      favoriteBlog = blog
    }
  })
  return favoriteBlog
}

const mostBlogs = (blogs) => {
  console.log('blogs = ', blogs)
  if (blogs.length === 0) {
    return {}
  } else {
    const authors = lodash.uniqBy(blogs, 'author')
    const count = lodash.countBy(blogs, 'author')
    const result = []
    authors.forEach((auth) => {
      const toAdd = {}
      toAdd.author = auth.author
      toAdd.blogs = count[auth.author]
      result.push(toAdd)
    })

    const max = lodash.maxBy(result, function (o) {
      return o.blogs
    })

    return max
  }
}

const mostLikes = (blogs) => {
  console.log('blogs = ', blogs)
  if (blogs.length === 0) {
    return {}
  } else {
    const authors = lodash.uniqBy(blogs, 'author')
    const result = []
    authors.forEach((auth) => {
      const toAdd = {}
      toAdd.author = auth.author
      toAdd.likes = lodash.sumBy(blogs, function (o) {
        return o.author === auth.author ? o.likes : 0
      })
      result.push(toAdd)
    })
    const max = lodash.maxBy(result, function (o) {
      return o.likes
    })
    return max
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
