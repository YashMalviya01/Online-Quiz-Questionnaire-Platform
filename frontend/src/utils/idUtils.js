export const extractId = (value) => {
  if (!value) return null;

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'object') {
    if (value._id) return String(value._id);
    if (value.id) return String(value.id);
    if (value.userId) return String(value.userId);
  }

  return null;
};

export const getUserId = (user) => extractId(user);

export const getQuizId = (quiz) => extractId(quiz);

export const getQuizCreatorId = (quiz) => {
  if (!quiz) return null;
  return extractId(quiz.createdBy);
};

export const getResultUserId = (result) => {
  if (!result) return null;
  return extractId(result.user);
};

export const idsEqual = (a, b) => {
  const left = extractId(a);
  const right = extractId(b);
  return Boolean(left && right) && left === right;
};
