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

module.exports = {
  dummy,
  totalLikes,
}
