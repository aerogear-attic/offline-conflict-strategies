const conflictResolvers = require('./conflictResolvers')
const { SyncServerError, detectConflict } = require('./detectConflict')

module.exports = {
  detectConflict,
  conflictResolvers
}