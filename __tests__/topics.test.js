const request = require('supertest')
const app = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data/index")

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end
})

describe("GET /api/topics tests", () => {
    describe('Happy path tests', () => {
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
    })
});