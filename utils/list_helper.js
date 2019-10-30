const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  var sum = 0;
  for (i = 0; i < blogs.length; i++) {
    sum += blogs[i].likes;
  }
  return sum;
}

const favoriteBlog = (blogs) => {
  var mostLikesAuthor;
  var mostLikesBlog;
  var mostLikes = 0;
  for (i = 0; i < blogs.length; i++) {
    if (mostLikes < blogs[i].likes) {
      mostLikesAuthor = blogs[i].author;
      mostLikesBlog = blogs[i].title;
      mostLikes = blogs[i].likes;
    }
  }
  return {
    author: mostLikesAuthor,
    title: mostLikesBlog,
    likes: mostLikes
  };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}