## Running the app
The easiest way to run the app is to use docker compose to create the service and all dependencies. 

`docker-compose pull`

`docker-compose up`

### Dependencies
The app requires: 
* hmpps-auth - for authentication
* nomis-user-roles-api - for authentication
* redis - session store and token caching

### Running the app for development

To start the main services excluding the example typescript template app: 

`docker-compose up redis hmpps-auth nomis-user-roles-api`

Install dependencies using `npm install`, ensuring you are using `node v18.x` and `npm v10.x`

Note: Using `nvm` (or [fnm](https://github.com/Schniz/fnm)), run `nvm install --latest-npm` within the repository folder to use the correct version of node, and the latest version of npm. This matches the `engines` config in `package.json` and the CircleCI build config.

Create a .env which should override environment variables required to run locally:

HMPPS_AUTH_URL=http://localhost:9090/auth
TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
TOKEN_VERIFICATION_ENABLED=false
NODE_ENV=development
SESSION_SECRET=anything
PORT=3000
SEND_LEGAL_MAIL_API_URL=http://localhost:8080
PRISON_REGISTER_API_URL=https://prison-register-dev.hmpps.service.justice.gov.uk
REDIS_HOST=localhost
API_CLIENT_ID=send-legal-mail-to-prisons
SYSTEM_CLIENT_ID=send-legal-mail-to-prisons-client

And then, to build the assets and start the app with nodemon:

npm run start:dev

Also running the API for development
This app needs the send-legal-mail-to-prisons-api project too which provides the back end for the front end.

See the API Readme for instructions to run the API for development too.

How do I sign in as a mailroom staff user?
Visit URL http://localhost:3000 which should redirect you to the HMPPS Auth sign in page. Enter credentials SLM_MAILROOM_USER_LOCAL / password123456.

How do I sign in as an admin user?
Visit URL http://localhost:3000 which should redirect you to the HMPPS Auth sign in page. Enter credentials SLM_ADMIN_LOCAL / password123456.

Run linter
npm run lint

Run tests
npm run test

Running integration tests
For local running, start a test db, redis, and wiremock instance by:

docker-compose -f docker-compose-test.yml up

Then run the server in test mode by:

npm run start-feature (or npm run start-feature:dev to run with nodemon)

And then either, run tests in headless mode with:

npm run int-test

Or run tests with the cypress UI:

npm run int-test-ui
