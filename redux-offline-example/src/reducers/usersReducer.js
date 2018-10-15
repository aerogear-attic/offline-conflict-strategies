const userReducer = (state = {results: []}, action) => {
  switch (action.type) {
    case "USER_FETCH":
      state = action.payload;
      break;
    default:
      break;
  }
  return state;
};

export default userReducer
