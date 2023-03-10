const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  console.log('loooog', blogs === 0 ? 0 : blogs.reduce(reducer, 0))
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
