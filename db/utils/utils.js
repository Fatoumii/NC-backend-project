exports.formatDate = list => {
  const newArr = [...list];
  newArr.forEach(obj => {
    obj.created_at = new Date(obj.created_at);
  });
  return newArr;
};

exports.makeRefObj = (list, key, value) => {
  return list.reduce((acc, obj) => {
    acc[obj[key]] = obj[value];
    return acc;
  }, {});
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(comment => {
    return {
      article_id: articleRef[comment.belongs_to],
      created_at: new Date(comment.created_at),
      body: comment.body,
      votes: comment.votes,
      author: comment.created_by
    };
  });
};
