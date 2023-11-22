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

describe("GET /api/articles/:article_id/comments tests", () => {
    test('responds with array of objects with the correct keys. The array has the correct length and the accompanying code should be status 200', () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(( { body }) => {
            expect(body.comments).toHaveLength(2)
            expect(body.comments).toBeSortedBy("created_at", { descending: true })
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),  
                    votes: expect.any(Number),  
                    created_at: expect.any(String),  
                    author: expect.any(String),  
                    body: expect.any(String),  
                    article_id: 3
                })               
            })
        })
    })
    test('should respond with a 200 and an empty array when given an valid article_id that doesn\'t exist', () => {
        return request(app)
        .get("/api/articles/999/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(0)
        })
    });
    test('should respond with a error status of 400 when passed an id of a invalid data type', () => {
        return request(app)
        .get("/api/articles/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
})





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