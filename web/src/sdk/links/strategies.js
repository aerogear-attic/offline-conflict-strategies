import diffMergeClientWins from "deepmerge";

export default {
    diffMergeClientWins,
    diffMergeServerWins: (server, client) => { return diffMergeClientWins(client, server) }
};