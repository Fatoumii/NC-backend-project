.NODE_ENV = "test";

const { expect } = require("chai");
const { formatDate, makeRefObj, formatComments } = require("../db/utils/utils");

describe("formatDate", () => {
  it("does not mutate original input", () => {
    const actual = formatDate([]);
    const expected = [];
    expect(actual).to.not.equal(expected);
  });
  it("changes the date when passed an array with one object", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const actual = formatDate(list);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1542284514171),
        votes: 100
      }
    ];
    expect(actual).to.eql(expected);
  });
  it("changes the date when passed an array with multiple objects", () => {
    const list = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1416140514171,
        votes: 100
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171
      }
    ];
    const actual = formatDate(list);
    const expected = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: new Date(1416140514171),
        votes: 100
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: new Date(154700514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("returns an empty object when passed an empty array", () => {
    const input = [];
    const actual = makeRefObj(input);
    const expected = {};
    expect(actual).to.eql(expected);
  });
  it("takes an array and returns a key value pair -key being the title and value being the ID", () => {
    const input = [
      {
        article_id: 1,
        title: "A"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 1 };
    expect(actual).to.eql(expected);
  });
  it("takes an array and returns a key value pair for multiple objects -key being the title and value being the ID", () => {
    const input = [
      {
        article_id: 1,
        title: "A"
      },
      {
        article_id: 2,
        title: "B"
      }
    ];
    const actual = makeRefObj(input, "title", "article_id");
    const expected = { A: 1, B: 2 };
    expect(actual).to.eql(expected);
  });
});

describe.only("formatComments", () => {
  it("changes the key names to created_by and belongs_to", () => {
    const comment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389
      }
    ];
    const formattedComments = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        article_id: 1,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(1511354163389)
      }
    ];
    const articleRef = { "They're not exactly dogs, are they?": 1 };
    expect(formatComments(comment, articleRef)).to.eql(formattedComments);
  });
});
