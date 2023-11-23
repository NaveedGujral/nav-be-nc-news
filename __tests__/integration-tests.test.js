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
        test('responds with array of objects with the correct keys. The array has the correct length and the accompanying code should be status 200', () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(( { body }) => {
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
    test('should respond with a 200 and an empty array when given an  article_id that exists but has no comments', () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
            expect(body.comments).toHaveLength(0)
        })
    });
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

describe('GET /api/articles/:article_id tests', () => {
    test('should respond with an object with the correct information', () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body).toMatchObject({
                article: {
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                }
            })
        })
    });
    test('should respond with a error status of 404 when passed a non-existent id', () => {
        return request(app)
        .get("/api/articles/140")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("article does not exist")
        })
    });
    test('should respond with a error status of 404 when passed an id of a invalid data type', () => {
        return request(app)
        .get("/api/articles/not-an-id")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
});

describe.only('PATCH /api/articles/:article_id', () => {
    test('should respond with 200 and an object with the correct information', () => {
        const newVoteObj = {
             inc_votes : 899 
        }
        return request(app)
        .patch("/api/articles/1")
        .send(newVoteObj)
        .expect(200)
        // .then((response) => {
        //     expect(response.body.comment).toMatchObject(
        //         {
        //             article: {
        //                 article_id: 1,
        //                 title: 'Living in the shadow of a great man',
        //                 topic: 'mitch',
        //                 author: 'butter_bridge',
        //                 body: 'I find this existence challenging',
        //                 created_at: '2020-07-09T20:11:00.000Z',
        //                 votes: 999,
        //                 article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' 
        //         }
        //     })
        // })
    });
});

/*

 test('should respond with the comment posted with an updated comments table when given a valid article id', () => {
        const newComment =  {
            username:"lurker",
            body:"I'm allergic to chicken"
          }

        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
            expect(response.body.comment).toMatchObject(
                {
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    article_id: 1,
                    created_at: expect.any(String)
                }
            )
        })
    });

*/

describe('GET /api tests', () => {
        test('should return an parsed JSON object with the correct information', () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(endpointJSONfile)
        })
    });
})