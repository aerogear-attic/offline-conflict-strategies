## React Web

Sample application using React and Apollo

## Running sample

```
npm link @aerogear/datasync-js
cd node_modules/@aerogear/datasync-js
npm run build
```

### Web project structure

- ./Mutations - folder containing implementation for mutations storage
Mutations store is enabled when webapp goes offline. We save individual mutations
and send them back to server when becoming offline

- ./View - View implementations done in react

- apolloClient - Main place where we setup main application cache, error handling etc.

- queries - plain graphql queries that are being send to server

We use graph.cool for testing. Sample schema is located in server folder

### Enable logging

`localStorage.debug = 'AeroGearSync:*'`
