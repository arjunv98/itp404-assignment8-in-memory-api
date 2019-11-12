const express = require("express");
const app = express();

app.use(express.json());

const db = {
  posts: [
    {
      id: 1,
      title: "Post 1",
      body: "something here..."
    },
    {
      id: 2,
      title: "Post 2",
      body: "something else here..."
    }
  ],
  comments: []
};

/* Posts */
app.get("/api/posts", (request, response) => {
  response.json(db.posts);
});

app.post("/api/posts", (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.get("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter(post => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put("/api/posts/:id", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body);
    response.json(post);
  } else {
    response.status(404).send();
  }
});

/* Comments */
app.get("/api/comments", (request, response) => {
  response.json(db.comments);
});

app.post("/api/comments", (request, response) => {
  const comment = request.body;
  const post = db.posts.find(post => {
    return post.id === comment.post;
  });

  if (!comment.hasOwnProperty("post")) {
    response.status(404).send({
      errors: {
        post: "post is required"
      }
    });
  } else if (!post) {
    response.status(404).send();
  } else {
    comment.id = db.comments.length + 1;
    db.comments.push(comment);
    response.json(comment);
  }
});

app.get("/api/posts/:id/comments", (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find(post => {
    return post.id === id;
  });

  if (post) {
    const comments = db.comments.filter(comment => {
      return comment.post === id;
    });
    response.json(comments);
  } else {
    response.status(404).send();
  }
});

app.delete("api/comments/:id", (request, response) => {
  // TODO
  const id = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === id;
  });

  if (comment) {
    db.comments = db.comments.filter(comment => {
      return comment.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put("api/comments/:id", (request, response) => {
  // TODO
  const id = Number(request.params.id);
  const comment = db.comments.find(comment => {
    return comment.id === id;
  });

  if (comment) {
    Object.assign(comment, request.body);
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.listen(8000);
