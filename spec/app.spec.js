process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const app = require("../app");
const request = require("supertest")(app);
const connection = require("../db/connection");
chai.use(require("chai-sorted"));

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(() => {
    connection.destroy();
  });
  it("status: 404 when passed an invalid path", () => {
    return request
      .get("/api/mr_robot")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.eql("Page not found");
      });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("status: 200, which gets an array of the topic object, including relevant keys", () => {
        return request
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics[0]).to.contain.keys("slug", "description");
          });
      });
      it("status: 405 for invalid methods", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/users", () => {
    describe("GET", () => {
      it("status: 200, which allows us to access a user object by a username", () => {
        return request
          .get("/api/users/rogersop")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.contain.keys("username", "avatar_url", "name");
          });
      });
      it("status: 405 for invalid methods", () => {
        const invalidMethods = ["post", "patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/users/butter_bridge")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("status: 404 when passing an invalid username", () => {
        return request
          .get("/api/users/fatimah")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("User not found");
          });
      });
      it("status: 404 when passing a username with an invalid syntax", () => {
        return request
          .get("/api/users/123")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("User not found");
          });
      });
    });
  });
  describe("/articles", () => {
    describe("GET articles by ID", () => {
      it("status: 200 which gets an object, including relevant keys", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("status: 404 when passed an article not present", () => {
        return request
          .get("/api/articles/100000")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Article not found");
          });
      });
      it("status: 400 when passing a bad request to access an article", () => {
        return request
          .get("/api/articles/northcoders")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
    });
    describe("PATCH articles by ID", () => {
      it("status: 200 which allows us to update the vote", () => {
        const newData = {
          inc_votes: 1
        };
        return request
          .patch("/api/articles/1")
          .send(newData)
          .expect(200)
          .then(({ body: { votes } }) => {
            expect(votes).to.eql(101);
          });
      });
      it("status: 400 when passing an invalid value", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "hi" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when sent more keys than necessary", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: "cat", name: "Mitch" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 200 when sent a body with no inc_votes property", () => {
        return request
          .patch("/api/articles/1")
          .expect(200)
          .send({})
          .then(({ body: { votes } }) => {
            expect(votes).to.eql(100);
          });
      });
    });
    describe("POST comments", () => {
      it("status: 201 returns an object, including relevant keys", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "Great post!"
          })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).to.contain.keys(
              "comment_id",
              "article_id",
              "created_at",
              "votes",
              "author",
              "body"
            );
          });
      });
      it("status: 422 posted a comment to an invalid article_id", () => {
        return request
          .post("/api/articles/1000/comments")
          .send({ username: "butter_bridge", body: "comment" })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Invalid request");
          });
      });
      it("status: 400 when passing an empty object to post", () => {
        return request
          .post("/api/articles/1/comments")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when not including all keys", () => {
        return request
          .post("/api/articles/1/comments")
          .send({
            comment_id: 19,
            article_id: 1,
            created_at: "2019-06-27T15:28:27.856Z",
            body: "Great post!"
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 422 when posting with invalid keys", () => {
        return request
          .post("/api/articles/1/comments")
          .send({ username: 123, body: 123 })
          .expect(422)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Invalid request");
          });
      });
    });
    describe("GET comments", () => {
      it(" status: 200 an array of comments for the given id with relevant keys", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment[0]).to.contain.keys(
              "comment_id",
              "votes",
              "created_at",
              "author",
              "body"
            );
          });
      });
      it("sorts the comments' created_at column by default ", () => {
        return request
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("can be sorted by any column when passed a valid query", () => {
        return request
          .get("/api/articles/1/comments?sort_by=comment_id")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.sortedBy("comment_id", {
              descending: true
            });
          });
      });
      it("can be sorted by ascending order when passed a query", () => {
        return request
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.be.ascendingBy("created_at");
          });
      });
      it("status: 400 when passed an invalid sort_by query", () => {
        return request
          .get("/api/articles/1/comments?sort_by=darlene")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when passed an invalid order value", () => {
        return request
          .get("/api/articles/1/comments?order=dogs")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("results in an empty array when the article exists but has no commments", () => {
        return request
          .get("/api/articles/3/comments")
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).to.eql([]);
          });
      });
    });
    describe("GET ", () => {
      it("status: 200 which results in an array of articles with relevant keys", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("sorts the comments' date column by defualt", () => {
        return request
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("can be sorted by any column when passed a valid query", () => {
        return request
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("title", {
              descending: true
            });
          });
      });
      it("can be sorted by ascending order when passed a valid query", () => {
        return request
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.ascendingBy("created_at");
          });
      });
      it("status: 400 when passed an invalid sort_by query", () => {
        return request
          .get("/api/articles?sort_by=jobs")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when passed an invalid order query", () => {
        return request
          .get("/api/articles?order=cats")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 200 which takes an author query which filters the articles by username provided", () => {
        return request
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].author).to.eql("icellusedkars");
          });
      });
      it("status: 200 which takes a topic query which filters the articles by topic provided", () => {
        return request
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].topic).to.eql("mitch");
          });
      });
      it("status: 400 when passed an invalid author query", () => {
        return request
          .get("/api/articles?author=fatimah")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when passed an invalid topic query", () => {
        return request
          .get("/api/articles?topic=codewars")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status:405 for invalid methods", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request[method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.eql("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/comments/:commentID", () => {
    it("status: 405 for invalid methods", () => {
      const invalidMethods = ["put", "post"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/comments/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
    describe("PATCH", () => {
      it("status: 200 updates the vote depending on commentID", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body: { votes } }) => {
            expect(votes).to.eql(26);
          });
      });
      it("status: 400 when passing an invalid value", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "boo" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when sent more keys than necessary", () => {
        return request
          .patch("/api/articles/1")
          .send({ inc_votes: 1, book: "The Great Gatsby" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 404 when updating a comment by commentID that doesnt exist", () => {
        return request
          .patch("/api/comments/1000")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Comment not found");
          });
      });
      it("status: 400 when passed invalid values", () => {
        return request
          .patch("/api/comments/1")
          .send({ inc_votes: "ten" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
      it("status: 400 when posting an empty object", () => {
        return request
          .patch("/api/comments/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
    });
    describe("DELETE", () => {
      it("status: 204 removes a comment by commentID", () => {
        return request.delete("/api/comments/1").expect(204);
      });
      it("status: 404 when deleting a comment that doesn't exist", () => {
        return request
          .delete("/api/comments/90909")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Comment not found");
          });
      });
      it("status: 400 when deleting a comment by invalid ID - wrong syntax", () => {
        return request
          .delete("/api/comments/northcoders")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql("Bad request");
          });
      });
    });
  });
});
