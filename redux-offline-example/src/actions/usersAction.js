export function listUsers() {
  return {
    type: "USER_FETCH",
    payload: {results: []},
    meta: {
      offline: {
        effect: {url: 'https://randomuser.me/api/?results=4', method: 'GET'},
        commit: {type: 'USER_FETCH_COMMIT'},
        rollback: {type: 'USER_FETCH_ROLLBACK'}
      }
    }
  }
}
