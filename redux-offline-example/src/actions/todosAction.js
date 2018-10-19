export function fetchTodos() {
  return {
    type: "TODO_LIST",
    payload: {},
    meta: {
      offline: {
        effect: {url: 'http://localhost:3004/todos', method: 'GET'},
        commit: {type: 'TODO_LIST_COMMIT'}
      }
    }
  }
}

export function createTodo(todo) {
  console.log(todo);
  return {
    type: "TODO_CREATE",
    payload: {todo},
    meta: {
      offline: {
        effect: {
          url: 'http://localhost:3004/todos',
          headers: {'content-type': 'application/json'},
          method: 'POST',
          body: JSON.stringify(todo),
        },
        commit: {type: 'TODO_CREATE_COMMIT', meta: {todo}},
        rollback: {type: 'TODO_CREATE_ROLLBACK', meta: {todo}}
      }
    }
  }
}

export function deleteTodo(todo) {
  return {
    type: "TODO_DELETE",
    payload: {todo},
    meta: {
      offline: {
        effect: {url: 'http://localhost:3004/todos/' + todo.id, method: 'DELETE'},
        commit: {type: 'TODO_DELETE_COMMIT', meta: {todo}},
        rollback: {type: 'TODO_DELETE_ROLLBACK', meta: {todo}}
      }
    }
  }
}
