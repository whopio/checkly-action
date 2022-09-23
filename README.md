# @whopio/checkly-action

Github Action + npm package that allows to sync a Checkly check group with a github repository. Features TypeScript tests, .har and .json file bundling and a local test runner.

## Setup

1. Create an empty repository or a new package in an already existing monorepo
   1. create a file called `checkly.config.json` in this directory
   2. also create a folder named `tests`, this folder is where all the checks live.
   3. add `.checkly` to your `.gitignore`
2. Install this package

```
npm i @whop-sdk/checkly-action --save-dev
```

```
yarn add @whop-sdk/checkly-action --dev
```

```
pnpm i @whop-sdk/checkly-action --save-dev
```

3. (Optional) for TypeScript support add `@whop-sdk/checkly-action` to `compilerOptions.types` in your tsconfig:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["@whop-sdk/checkly-action", "node"]
  }
}
```

## Github Action

```yml
name: Sync Check Group

on:
  push:
    branches: [main]
    paths:
      - examples/basic/**/*

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2.2.2
        with:
          version: 7
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: "pnpm"
      - name: Install Node Modules
        run: pnpm i
      - uses: whopio/checkly-action@v0.2.0
        with:
          checkly-token: ${{ secrets.CHECKLY_TOKEN }}
          checkly-group: ${{ secrets.CHECKLY_GROUP }}
          checkly-account: ${{ secrets.CHECKLY_ACCOUNT }}
          directory: ./examples/basic
```

### Inputs

| name            | description                                                           | required | default |
| --------------- | --------------------------------------------------------------------- | :------: | :-----: |
| checkly-token   | Your Checkly API token                                                |    X     |         |
| checkly-group   | Checkly Group to sync with                                            |    X     |         |
| checkly-account | Checkly Account ID                                                    |    X     |         |
| directory       | tests root                                                            |          |   ./    |
| s3-key          | s3 secret for large checks                                            |          |         |
| s3-key-id       | key id matching s3-key                                                |          |         |
| s3-bucket       | name of the s3 bucket to upload checks to                             |          | checkly |
| s3-endpoint     | target s3 endpoint                                                    |          |         |
| s3-region       | s3 region                                                             |          |  auto   |
| max-script-size | the maximum amount of characters in a check before s3 loading is used |          |         |

## S3 Integration for supporting large scripts

Checkly only allows for around 1.000.000 characters in a test script. To bypass this restriction this library supports uploading the scripts to a s3 bucket and then uploading a loader that downloads the script from s3 and then executes it.

As uploading scripts with more than 300.000 characters already produces errors when pushing it to Checkly, by default this action will use the s3 loader for scripts with 100.000 chars or more. This setting can be controlled through the `max-script-size` input of the Action.

In order for this to work you will need to supply the s3 related inputs to the Action.

## Writing Checks

Every check file can export a `config` that defined the checks parameters on checkly and export the check logic as the default export. The check function receives a context parameter that contains the browser and playwright context instances by default and can be extended using the `Setup and Teardown` feature.

### Basic Check

```ts
import { DefaultContext, CheckConfig } from "@whop-sdk/checkly-action";

export const config: CheckConfig = {
  activated: false,
  muted: true,
  doubleCheck: true,
  shouldFail: false,
};

export default async ({ browser }: DefaultContext) => {
  const page = await browser.newPage();
  await page.goto("https://google.com");
};
```

### Setup and Teardown

Next to normal checks every directory can contain `_before` and `_after` files that run before and after each test in the directory and have the ability to modify the context passed to the final testing script

#### Execution Order

Assuming we have the following file structure

```
tests
|-sub-task
| |-_after.ts
| |-_before.ts
| |-example.ts
|-_after.ts
|-_before.ts
```

the final execution order when `tests/sub-task/example.ts` is being ran is the following:

```
/tests/_before.ts
/tests/sub-task/_before.ts
/tests/sub-task/example.ts
/tests/sub-task/_after.ts
/tests/_after.ts
```

#### TypeScript

To infer the context of a test, `_before` or `_after` file a helper type is exported from this library.
Assuming we have the following file structure:

```
tests
|-_before.ts
|-example.ts
```

The type of the context inside of example.ts can be inferred like this:

```ts
import { InferContext } from "@whop-sdk/checkly-action";
import type before from "./_before";

export default async (ctx: InferContext<typeof before>) => {};
```

Note that the `before` import has to be targeting the last `_before` file executed before the it's being used in.

### Using .har and .json files

The bundler automatically wraps .har and .json imports in a loader that writes the file to disk and resolves with the filename

```ts
// tests
// |-example.har
// |-example.ts

// example.ts:
import { DefaultContext, CheckConfig } from "@whop-sdk/checkly-action";
import fileName, { release } from "./example.har";

export default async ({ context }: DefaultContext) => {
  // await the fileName
  context.routeFromHar(await fileName());

  // perform the check

  // release the file from disk (important for local testing)
  await release();
};
```

## Running Checks locally

This library includes a CLI util that allows for running tests locally.

### Setup

#### package.json setup

```json
{
  "scripts": {
    "test": "checkly-action run"
  }
}
```

### Run all Checks

```
pnpm run test
```

### Run filtered Checks

Filters consider the `tests` directory the root and ignore the file extension.

```
tests
|-sub-task
| |-sub-task
| | |-example5.ts
| | |-example6.ts
| |-example3.ts
| |-example4.ts
|-example1.ts
|-example2.ts
```

This will only run `tests/example1.ts`

```
pnpm run test --filter example1
```

The filter uses glob patterns to match, so this would run all tests in `tests/sub-task`, excluding any further nested tests:

```
pnpm run test --filter sub-task/*
```

To include the nested tests too:

```
pnpm run test --filter sub-task/**/*
```

Lastly, multiple filters can be passed resulting in the following command running `tests/example1.ts` and all tests in `tests/sub-task`:

```
pnpm run test --filter example1 --filter sub-task/**/*
```

### Using .env files

To supply the local tests with Environment Variables, a `.env` file can be created next to the `package.json`
