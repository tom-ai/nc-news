const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => seed(testData));
afterAll(() => {
  connection.end();
});

describe("Comments", () => {
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
  
    describe("POST /comment", () => {
      test("status: 201, responds with newly created comment", () => {
        const articleId = 1;
        const comment = {
          username: "butter_bridge",
          body: "This is a comment",
        };
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ comment })
          .expect(201)
          .then(({ body: { postedComment } }) => {
            expect(postedComment).toEqual({
              body: "This is a comment",
              comment_id: expect.any(Number),
              article_id: 1,
              author: "butter_bridge",
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
      });
      test("status: 404, article does not exist", () => {
        const articleId = 99999;
        const comment = {
          username: "butter_bridge",
          body: "This is a comment",
        };
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ comment })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Not found");
          });
      });
      test("status: 404, user does not exist", () => {
        const articleId = 1;
        const comment = {
          username: "butter_bridgeeeeee",
          body: "This is a comment",
        };
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ comment })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Not found");
          });
      });
      test("status 400: malformed body", () => {
        const articleId = 1;
        const comment = {
          username: "butter_bridge",
          comment: "This has an incorrectly named property",
        };
        return request(app)
          .post(`/api/articles/${articleId}/comments`)
          .send({ comment })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toEqual("Malformed comment body");
          });
      });
    });
  
    describe("delete commit by id", () => {
      test("status: 204, deletes comment", () => {
        const commentId = 1;
        return request(app).delete(`/api/comments/${commentId}`).expect(204);
      });
      test("status: 404, comment not found", () => {
        const commentId = 99999;
        return request(app)
          .delete(`/api/comments/${commentId}`)
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not found");
          });
      });
      test("status: 400, invalid comment id", () => {
        const commentId = "notAValidId";
        return request(app)
          .delete(`/api/comments/${commentId}`)
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid request");
          });
      });
    });
  });
  