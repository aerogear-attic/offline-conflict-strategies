# Apollo Offline Spikes

# Investigation for offline state using Apollo link

Investigation is using Apollo link to perform filtering for graphQL network layer.
We have build simple React Starter App that adds new users.
We can simulate conflicts by editing data on the server and making change when offline.

## Structure

- ./Mutations - folder containing implementation for mutations storage
Mutations store is enabled when webapp goes offline. We save individual mutations 
and send them back to server when becoming offline

- ./View - View implementations done in react

- apolloClient - Main place where we setup main application cache, error handling etc.

- queries - plain graphql queries that are being send to server

We use graph.cool for testing. Sample schema is located in server folder