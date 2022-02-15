const request = require("supertest");
const app = require('../app')
const connection = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

beforeEach(() => seed(testData));
afterAll(() => {
    connection.end()
})

// 500 server error


describe('/api', () => {
    describe('Universal errors', () => {
        test('status: 404, path does not exist', () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid path')
            })
        })
    });
    describe('GET /topics', () => {
        test('Status: 200, responds with an array of topics', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body.topics).toHaveLength(3)
            })
        })        
        test('Status: 200, each item looks correct', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body: {topics}}) => {
                topics.forEach(topic => {
                    expect(topic).toEqual(
                        expect.objectContaining({
                            description: expect.any(String),
                            slug: expect.any(String)
                        })
                    )
                })
            })
        })
    });
    describe('GET /articles', () => {
        describe('/api/articles/:article_id', () => {
            test('status: 200, responds with article object', () => {
                const article_id = 1;
                return request(app)
                .get(`/api/articles/${article_id}`)
                .expect(200)
                .then(({body}) => {
                    expect(body.article).toEqual( {
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: "2020-07-09T20:11:00.000Z",
                        votes: 100,
                    })
                })
            })
            test('status: 404, item not found', () => {
                const articleId = 9999999
                return request(app)
                .get(`/api/articles/${articleId}`)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('Item not found')
                })
            })
            test.only('status: 400, invalid ID', () => {
                const articleId = 'banana'
                return request(app)
                .get(`/api/articles/${articleId}`)
                .expect(400)
                .then(({body: {msg}}) => {
                    // console.log(msg)
                    expect(msg).toBe('Invalid ID')
                })
            })
        });
    });
});