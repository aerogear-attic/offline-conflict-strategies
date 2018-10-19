const todoReducer = (state = [], action) => {
  switch (action.type) {
    case "TODO_LIST":
      break;
    case "TODO_LIST_COMMIT":
      state = action.payload;
      break;
    case "TODO_CREATE":
      state = [...state, action.payload.todo];
      break;
    case "TODO_CREATE_COMMIT":
      break;
    case "TODO_CREATE_ROLLBACK":
      state = state.filter(todo => todo.id !== action.meta.todo.id);
      break;
    case "TODO_DELETE":
      state = state.filter(todo => todo.id !== action.payload.todo.id);
      break;
    case "TODO_DELETE_COMMIT":
      break;
    case "TODO_DELETE_ROLLBACK":
      state = [...state, action.meta.todo];
      break;
    default:
      break;
  }
  return state;
};

export default todoReducer
