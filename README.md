# AzAuth NodeJS

[![npm version](https://img.shields.io/npm/v/azuriom-auth.svg?style=flat-square)](https://www.npmjs.org/package/azuriom-auth)
[![tests](https://img.shields.io/github/workflow/status/Azuriom/AzAuthJS/Tests?style=flat-square)](https://github.com/Azuriom/AzAuthJS/actions)
[![chat](https://img.shields.io/discord/625774284823986183?color=7289da&label=discord&logo=discord&logoColor=fff&style=flat-square)](https://azuriom.com/discord)

A NodeJS implementation in [TypeScript](https://www.typescriptlang.org/) of the [Azuriom Auth API](https://azuriom.com/docs/api-auth).

## Installation

```
npm install azuriom-auth
```

## Usage

```js
const AzuriomAuth = require('azuriom-auth');

async function login(email, password) {
  const authenticator = new Authenticator('<url of your website>');

  try {
    const user = await authenticator.auth(email, password);

    console.log(`Logged in with ${user.email}`);
  } catch (e) {
    console.log(e);
  }
}
```