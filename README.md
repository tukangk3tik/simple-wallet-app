# Simple Wallet App

This application was created for demo simple wallet app with asynchronous transaction.

List of stack:

* NodeJs with Fastify
* PostgreSQL
* Prisma
* Docker

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Running with Docker](#running-with-docker)
4. [API Documentation](#api-documentation)
5. [Testing the App](#testing-the-app)

## Installation

To install and run this application locally, follow these steps:

```sh
$ git clone https://github.com/username/backend-app.git
$ cd simple-wallet-app
$ npm install
```

Configure your .env file based by .env.example and adjust the parameters:

```sh
$ cp .env.example .env
```

## Usage

Makesure your postgres is running and migrate and seed the database with this command:

```sh
$ npm run prisma:generate
$ npm run prisma:db:init
$ npm run prisma:db:seed
```

To start the api service, run the following command:

```sh
$ npm run build
$ npm run start
```

## Running with Docker

To install and run this application with docker, follow these steps:

```sh
$ git clone https://github.com/username/backend-app.git
$ cd simple-wallet-app
```

Configure your .env file based by .env.example and adjust the parameters:

```sh
$ cp .env.example .env
```

Then run database and api service with single command:

```sh
docker-compose up
```

## API Documentation

For the API documentation you can check the postman collection with its example and environment. You can get the postman by this links:

* [Postman collection](https://github.com/tukangk3tik/simple-wallet-app/blob/main/docs/WalletApp.postman_collection.json)
* [Postman env](https://github.com/tukangk3tik/simple-wallet-app/blob/main/docs/WalletApp.postman_environment.json)

Below is list of route provided:

- **User login**
  - Route: ``(POST) /auth/login``
  - Required body: email _(string)_, password _(string)_
- **User register**
  - Route: ``(POST) /register``
  - Required body: email _(string)_, password _(string)_, name _(string)_
- **Get user wallets**
  - Route: ``(GET) /user/wallets``
  - Required header: Authorization: Bearer <jwt_token>
- **Get user transaction histories**
  - Route: ``(GET) /user/wallets/:walletId/histories``
  - Required header: Authorization: Bearer <jwt_token>; path params: walletId _(int)_
- **Check transaction status**
  - Route: ``(GET) /transaction/:transactionId`` 
  - Required header: Authorization: Bearer <jwt_token>; path params: `transactionId` _(string)_
- **User withdraw**
  - Route: ``(POST) /transaction/withdraw``
  - Required header: Authorization: Bearer <jwt_token>; body: accountType _(int)_, amout _(int/float)_, toAddress _(string)_
 
## Testing the App
You can use 2 user for simulating the transaction. Lisf of user:
1. ```
   Email: alice@prisma.io
   Password: test1234
   ```
   
2. ```
   Email: bob@prisma.io
   Password: test1234
   ```
