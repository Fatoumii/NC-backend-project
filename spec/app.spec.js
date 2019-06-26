process.env.NODE_ENV = "test";

const chai = require("chai");
const { expect } = chai;
const app = require("../app");
const request = require("supertest")(app);
const connection = require("../db/connection");

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
          .get("/api/users/butter_bridge")
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
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("status: 200 which gets an object, including relevant keys", () => {
        return request
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.contain.keys(
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
    describe("PATCH", () => {
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
    });
  });
});
//test 405 for articles path
