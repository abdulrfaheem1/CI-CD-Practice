# Task Tracker

A beginner-friendly task tracker built with React, Vite, Node.js, and Express. You can add tasks, mark them complete or incomplete, and delete them.

Tasks are stored in the API server's memory. They are reset when the server restarts; this keeps the first version simple and avoids setting up a database.

## Run it locally

You need Node.js 22 or newer and npm.

1. Open a terminal in this project folder and install the dependencies:

   ```sh
   npm ci
   ```

2. Start the API in the first terminal:

   ```sh
   npm run server
   ```

   The API listens at `http://localhost:3001`.

3. Open a second terminal in the project folder and start the React app:

   ```sh
   npm run dev
   ```

4. Open the local address printed by Vite, usually `http://localhost:5173`.

Vite forwards requests beginning with `/api` to the Express server, so the browser app and API work together during development.

## Tests and checks

Run these from the project folder:

```sh
npm test
npm run lint
npm run build
```

- `npm test` runs API tests with Node's built-in test runner.
- `npm run lint` checks the JavaScript and React files for common mistakes.
- `npm run build` creates the production frontend in `dist/` and checks that the backend JavaScript parses correctly. The backend runs directly on Node.js, so it does not need a separate compilation step.

## Project files

- `src/App.jsx` contains the task form, task list, and requests to the API.
- `src/App.css` styles the task tracker.
- `src/index.css` sets global page styles.
- `server/app.js` creates the Express API and stores tasks in memory.
- `server/index.js` starts the API server.
- `server/app.test.js` checks the task API using Node's built-in test tools.
- `vite.config.js` configures Vite's development proxy to the API.
- `.github/workflows/ci.yml` runs tests, linting, and builds on GitHub Actions.

## GitHub Actions CI

The workflow in `.github/workflows/ci.yml` runs automatically when code is pushed or a pull request is opened:

1. It checks out the repository so the workflow can use the project files.
2. It installs Node.js 22 and enables npm's dependency cache.
3. `npm ci` installs the exact dependency versions recorded in `package-lock.json`.
4. `npm test` runs the API tests.
5. `npm run lint` checks the source files.
6. `npm run build` builds the React frontend and checks the backend JavaScript.

The API runs directly on Node.js and does not need a separate compile step.
