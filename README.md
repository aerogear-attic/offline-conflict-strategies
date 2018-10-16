# Apollo Offline Spikes

Collection of projects and example apps used for offline investigations. 


## Folders

- redux-offline-example - React app using redux offline
- server-apollo	- apollo server used with web app
- server-graphcool - graph.cool project that can be used with web app
- web - react app using Apollo Boost and Offline mutations 

Web app is 


## Web project

Web project is used to experiment using Apollo client for javascript. 

### Investigation for offline state using Apollo link

Investigation is using Apollo link to perform filtering for graphQL network layer.
We have build simple React Starter App that adds new users.
We can simulate conflicts by editing data on the server and making change when offline.

### Web project structure

- ./Mutations - folder containing implementation for mutations storage
Mutations store is enabled when webapp goes offline. We save individual mutations 
and send them back to server when becoming offline

- ./View - View implementations done in react

- apolloClient - Main place where we setup main application cache, error handling etc.

- queries - plain graphql queries that are being send to server

We use graph.cool for testing. Sample schema is located in server folder
