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
    test('responds with array of objects with the correct keys and topic when queried. The array has the correct length and the accompanying code should be status 200', () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(( { body }) => {
            expect(body.articles).toHaveLength(1)
            expect(body.articles).toBeSortedBy("created_at", { descending: true })
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: "cats",
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                })               
            })
        })
    })
    test('responds with empty array of objects when queried a topic that does not exist. The array has the correct length and the accompanying code should be status 200', () => {
        return request(app)
        .get("/api/articles?topic=dogs")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("topic does not exist")
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
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: 11
                }
            })
        })
    });
    test('should respond with a error status of 404 when passed a non-existent id', () => {
        return request(app)
        .get("/api/articles/999")
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

describe('POST /api/articles/:article_id/comments test', () => {
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
    test('should respond with a 201 when given a request body with additional properties', () => {
        const newComment =  {
            username:"lurker",
            body:"I'm allergic to chicken",
            location: "Manchester",
            job: "bin man"
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
    test('should respond a 404 and when given a username that does not exist ', () => {
        const newComment =  {
            username:"iLoveChicken",
            body:"I'm allergic to chicken"
          }
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("user does not exist")
        })
    });
    test('should respond with a 404 when given a valid article id that does not exist', () => {
        const newComment =  {
            username:"lurker",
            body:"I'm allergic to chicken"
          } 
        return request(app)
        .post("/api/articles/999/comments")
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("article does not exist")
        })
    });
    test('should respond with a 400 when given a invalid article id', () => {
        const newComment =  {
            username:"lurker",
            body:"I'm allergic to chicken"
          } 
        return request(app)
        .post("/api/articles/not-an-id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    })
   test('should respond with a 400 when given a request body with a missing "body" property', () => {
        const newComment =  {
            username:"lurker"
          } 
        return request(app)
        .post("/api/articles/1/comments")
        .send(newComment)
    });
})

describe('PATCH /api/articles/:article_id', () => {
    test('should respond with 200 and an object with the correct information', () => {
        const newVoteObj = {
             inc_votes : 899 
        }
        return request(app)
        .patch("/api/articles/1")
        .send(newVoteObj)
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject(
                {
                    article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 999,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' 
                }
            })
        })
    });
    test('should respond with 200 and an object with the correct information when passed an object with additional propeties', () => {
        const newVoteObj = {
             inc_votes : 899,
             date: 210393,
             location: "manchester" 
        }
        return request(app)
        .patch("/api/articles/1")
        .send(newVoteObj)
        .expect(200)
        .then((response) => {
            expect(response.body).toMatchObject(
                {
                    article: {
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 999,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700' 
                }
            })
        })
    });
    test('should respond 404 and the message "article does not exist" and when given a valid article_id that does not exist ', () => {
        const newVoteObj = {
            inc_votes : 899 
       }
       return request(app)
        .patch("/api/articles/999")
        .send(newVoteObj)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("article does not exist")
        })
    });
    test('should respond with a 400 when given a invalid article id', () => {
        const newVoteObj = {
            inc_votes : 899 
       }
        return request(app)
        .patch("/api/articles/not-an-id")
        .send(newVoteObj)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
    test('should respond with a 400 when the request body is missing', () => {
        const newVoteObj = {}
        return request(app)
        .patch("/api/articles/1")
        .send(newVoteObj)
    })
    test('should respond with a 400 when the request body is has an invalid data-type', () => {
        const newVoteObj = {
            inc_votes : "fish" 
        }
        return request(app)
        .patch("/api/articles/1")
        .send(newVoteObj)

        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Bad Request")
        })
    });
})

describe('DELETE /api/comments/:comment_id tests', () => {
    test('should respond with only 204 with valid comment_id. Comments table should have the relevant entry removed', () => {
        request(app)
        .get("/api/articles/9/comments")
        .then(({ body }) => {
            expect(body.comments[0].comment_id).toBe(1)     
            expect(body.comments[1].comment_id).toBe(17)     
            expect(body.comments).toHaveLength(2)     
        })
        return request(app) 
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
            return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toHaveLength(1)
                expect(body.comments[0].comment_id).toBe(17)     
            }) 
        })
    });
    test('responds with 404 and error message "comment does not exist" when given a non-existent id', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((response) => {
        expect(response.body.msg).toBe('comment does not exist');
      });
    });
    test('responds with 400 and error message "Bad Request" when given a invalid id', () => {
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)
        .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
    });
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
})

describe('GET /api/users tests', () => {
    test('responds with array of objects with the correct keys. The array has the correct length and the accompanying code should be status 200', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(( { body }) => {
            expect(body.users).toHaveLength(4)
            body.users.forEach((user) => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })               
            })
        })
    })
})