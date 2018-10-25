
function defaultResolver (conflict, currentRecord, args) {
  if (conflict) {
    console.warn(`Conflict detected. Server: ${currentRecord} client: ${args}`)
    throw conflict;
  }
}

module.exports = {
  default: defaultResolver
}