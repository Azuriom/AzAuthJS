# AzAuth JS

[![Node.js CI](https://img.shields.io/github/actions/workflow/status/Azuriom/AzAuthJS/tests.yml?branch=master&style=flat-square)](https://github.com/Azuriom/AzAuthJS/actions/workflows/tests.yml)
[![npm Version](https://img.shields.io/npm/v/azuriom-auth.svg?style=flat-square)](https://www.npmjs.org/package/azuriom-auth)
[![Chat](https://img.shields.io/discord/625774284823986183?color=5865f2&label=Discord&logo=discord&logoColor=fff&style=flat-square)](https://azuriom.com/discord)

A JavaScript implementation made in [TypeScript](https://www.typescriptlang.org/) of the [Azuriom Auth API](https://azuriom.com/docs/api-auth).

## Installation

```
npm install azuriom-auth
```

## Usage

```js
import { AuthClient } from 'azuriom-auth'

async function login(email, password) {
  const client = new AuthClient('<url of your website>')

  let result = await client.login(email, password)

  if (result.status === 'pending' && result.requires2fa) {
    const twoFactorCode = '<two factor code>' // IMPORTANT: Replace with the 2FA user temporary code

    result = await client.login(email, password, twoFactorCode)
  }

  if (result.status !== 'success') {
    throw 'Unexpected result: ' + JSON.stringify(result)
  }

  return result
}
```
