const request = require("supertest");
const app = require('../app')
const connection = require('../db/connection')
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data/index')

beforeEach(() => seed(testData));
afterAll(() => {
    connection.end()
})

describe('App tests', () => {
    describe('Topics', () => {
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
        test('status: 404, path does not exist', () => {
            return request(app)
            .get('/api/notARoute')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe('Invalid path')
            })
        })
    });
    
});