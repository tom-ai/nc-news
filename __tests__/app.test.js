const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => {
  connection.end();
});

describe("Universal errors", () => {
  test("status: 404, path does not exist", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("GET /topics", () => {
  test("status: 200, responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
      });
  });
  test("status: 200, each item looks correct", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              slug: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET article by ID", () => {
  test("status: 200, responds with article object", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          })
        );
      });
  });
  test("status: 404, item not found", () => {
    const articleId = 9999999;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("status: 400, invalid ID", () => {
    const articleId = "banana";
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid request");
      });
  });
});

describe("GET /users", () => {
  test("status: 200, responds with an array of user objectse", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
      });
  });
  test("status: 200, each object should contain a username property", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /articles", () => {
  test("status: 200, responds with an array of articles objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status: 200, by default articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe('sort_by', () => {
    test('status: 200, sort_by sorts the articles (date by default)', () => {
      return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toBeSortedBy("title", {descending: true})
      })
    })
    test('status: 400, invalid sort_by query', () => {
      return request(app)
      .get("/api/articles?sort_by=invalid_query")
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('Invalid sort_by query')
      })
    })
  });
  describe('order by ASC or DESC', () => {
    test('status: 200, articles order can be overided to ASC)', () => {
      return request(app)
      .get("/api/articles?order=desc")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toBeSorted()
      })  
    })
    test('status: 200, articles can be sorted and ordered', () => {
      return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles).toBeSortedBy("author")
      })  
    })
    test('status: 400, invalid order query', () => {
      return request(app)
      .get("/api/articles?sort_by=author&order=invalid_order")
      .expect(400)
      .then(({ body: { msg }}) => {
        expect(msg).toBe('Invalid order query')
      })  
    })
    test('status: 200, articles filtered by topic', () => {
      const slug = 'mitch'
      return request(app)
      .get(`/api/articles?topic=${slug}`)
      .expect(200)
      .then(({body: {articles}}) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              topic: 'mitch'
            }))
        })
      })
    })
    test('status: 400, invalid filter query', () => {
      return request(app)
      .get('/api/articles?topic=invalid_filter')
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).toBe('Invalid filter query')
      })
    })
  });
});



describe("PATCH article vote count", () => {
  test("status: 200, article vote increments by vote amount", () => {
    const articleId = 2;
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(newVote)
      .expect(202)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
          article_id: 2,
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 5,
        });
      });
  });
  test("status: 200, article votes can decrement by any given amount", () => {
    const articleId = 2;
    const newVote = { inc_votes: -5 };

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send(newVote)
      .expect(202)
      .then(({ body: { updatedArticle } }) => {
        expect(updatedArticle).toEqual({
          article_id: 2,
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: -5,
        });
      });
  });
  test("status: 400, malformed body or missing fields", () => {
    const articleId = 2;
    const newVote = 1;

    return request(app)
      .patch(`/api/articles/${articleId}`)
      .send({ newVote })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid vote");
      });
  });
});

describe('POST /comment', () => {
  test('status: 201, responds with newly created comment', () => {
    const articleId = 1
    const comment = {
        username: 'butter_bridge',
        body: 'This is a comment'
    }
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send({comment})
    .expect(201)
    .then(({body: {postedComment}}) => {
        expect(postedComment).toEqual({
          body: 'This is a comment',
          comment_id: expect.any(Number),
          article_id: 1,
          author: 'butter_bridge',
          votes: expect.any(Number),
          created_at: expect.any(String)
        })
    })
  });
  test('status: 404, article does not exist', () => {
    const articleId = 99999
    const comment = {
        username: 'butter_bridge',
        body: 'This is a comment'
    }
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send({comment})
    .expect(404)
    .then(({body: {msg}}) => {
        expect(msg).toEqual('Not found') 
    })
  })
  test('status: 404, user does not exist', () => {
    const articleId = 1
    const comment = {
        username: 'butter_bridgeeeeee',
        body: 'This is a comment'
    }
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send({comment})
    .expect(404)
    .then(({body: {msg}}) => {
        expect(msg).toEqual('Not found')
    })
  })
  test('status 400: malformed body', () => {
    const articleId = 1
    const comment = {
        username: 'butter_bridge',
        comment: 'This has an incorrectly named property'
    }
    return request(app)
    .post(`/api/articles/${articleId}/comments`)
    .send({comment})
    .expect(400)
    .then(({body: {msg}}) => {
        expect(msg).toEqual('Malformed body') 
    })
  })
})

describe("GET /comments", () => {
  test("responds with an array of comments for the given article_id", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(200)
      .then(({ body: { comments } }) => {
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });

  test("status: 404, article not found", () => {
    const articleId = 9999999;
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });

  test("status: 400, invalid article ID", () => {
    const articleId = "apples";
    return request(app)
      .get(`/api/articles/${articleId}/comments`)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid request");
      });
  });
});

describe("Feature: Comment count in article - 10", () => {
  test("status 200: each object in array includes a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              comment_count: expect.any(String),
            })
          );
        });
      });
  });

  test("status: 200, article response object contains comment count", () => {
    const articleId = 1;
    return request(app)
      .get(`/api/articles/${articleId}`)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          comment_count: expect.any(String), // Cannot convert to number in query
        });
      });
  });
});
