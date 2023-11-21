const request = require('supertest')
const app = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data/index")
const endpointJSONfile = require(`../endpoints.json`)

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("GET /api/topics tests", () => {
        test('responds with array of objects with the correct keys. The array has the correct length and the accompanying code should be status 200', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(( { body }) => {
                const output = Array.isArray(body.topics)
                const expected = true
                expect(output).toEqual(expected)
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic) => {
                    expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                })               
            })
        })
    })
});

describe("GET /api/articles tests", () => {
        test.only('responds with array of objects with the correct keys. The array has the correct length and the accompanying code should be status 200', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(( { body }) => {
                
                console.log(body)
                const output = Array.isArray(body.articles)
                const expected = true
                expect(output).toBe(expected)

                expect(body.articles).toHaveLength(13)
                expect(body.articles).toBeSortedBy("created_at", { descending: true })
                
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                })               
            })
        })
    })
});

describe('GET /api tests', () => {
        test('should return an parsed JSON object with the correct information', () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpointJSONfile)
        })
    });
});