# Apollo Offline Spikes

Collection of projects and example apps used for offline investigations.


## Folders

- server-apollo	- apollo server used with web app
- web - react app using Apollo Boost and Offline mutations

Web app is the main project for spikes

## Web project

Web project is used to experiment using Apollo client for javascript.

### Investigation for offline state using Apollo link

Investigation is using Apollo link to perform filtering for graphQL network layer.
We have build simple React Starter App that adds new users.
We can simulate conflicts by editing data on the server and making change when offline.

### Pre-requisites

cordova:
```
npm i -g cordova@8.1.2
```

A local copy of the Aerogear javascript sdk:

```
git clone git@github.com:aerogear/aerogear-js-sdk.git
cd packages/sync
npm run build
npm link .
```

This repo consists of two parts, the server and the mobile app (cordova).

### Running the server

```
cd ./server
docker-compose up -d
npm install
npm run start
```

### Running the App

#### Web View:

```
cd ./app
npm install
npm run start
```

#### iOS

```
cd ./app
npm install
npm run start-ios
```

#### Android

```
cd ./app
npm install
npm run start-android
```