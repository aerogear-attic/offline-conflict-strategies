const userReducer = (state = {results: []}, action) => {
  switch (action.type) {
    case "USER_FETCH":
      break;
    case "USER_FETCH_COMMIT":
      state = {
        ...state,
        results: action.payload.results
      };
      break;
    case "USER_FETCH_ROLLBACK":
      console.log(action.type);
      console.log(action.payload);
      break;
    default:
      break;
  }
  return state;
};

export default userReducer
