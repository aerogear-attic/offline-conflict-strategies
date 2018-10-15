export function listUsers() {
  return dispatch => {
    fetch('https://randomuser.me/api/?results=4')
      .then(response => {
        return response.json()
      })
      .then(result => dispatch({
        type: "USER_FETCH",
        payload: result
      }))
  }
}
