exports.formatDate = list => {
  const newArr = [...list];

  newArr.forEach(obj => {
    obj.created_at = new Date(obj.created_at);
  });
  return newArr;
};

exports.makeRefObj = list => {};

exports.formatComments = (comments, articleRef) => {};
