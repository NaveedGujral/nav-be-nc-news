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

describe("GET /api/healthcheck", () => {
    test("200: responds with an okay message", () => {
        return request(app)
        .get("/api/healthcheck")
        .expect(200)
        .then(({ body }) => {
            expect(body.msg).toBe("all okay");
        });
    });
});

describe("GET /api/topics tests", () => {
    describe('Happy path tests', () => {
        test('200: responds with an okay message', () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
        })
        test('responds with array', () => {
            return request(app)
            .get("/api/topics")
            .then(( { body }) => {
                const output = Array.isArray(body.topics)
                const expected = true
                expect(output).toEqual(expected)
            })
        })
        test('responds with array of objects with properties of slug and description', () => {
            return request(app)
            .get("/api/topics")
            .then(( { body }) => {
                let output = true;
                body.topics.forEach((topic) => {
                    if (topic.hasOwnProperty('slug') === false) {
                        output = false
                    }
                    else if (topic.hasOwnProperty('description') === false) {
                        output = false
                    }
                })
                const expected = true
                expect(output).toBe(expected);
            });
        });
    });
});