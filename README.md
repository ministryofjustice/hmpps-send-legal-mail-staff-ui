# hmpps-send-legal-mail-staff-ui

## About
Typescript application for prison staff to allow scanning barcodes for legal mail (aka rule39 mail).

### Team
The project is currently maintained by `book-a-prison-visit` team.

### Health
The application has a health endpoint found at `/health` which indicates if the app is running and is healthy.

### Ping
The application has a ping endpoint found at `/ping` which indicates that the app is responding to requests.

### Maintenance pages
TBD.

### Build
<em>Requires membership of Github team `book-a-prison-visit`</em>

The application is built on [CircleCI](https://app.circleci.com/pipelines/github/ministryofjustice/hmpps-send-legal-mail-staff-ui).

### Versions
The application version currently running can be found on the `/health` endpoint at node `build.buildNumber`. The format of the version number is `YYY-MM-DD.ccc.gggggg` where `ccc` is the Circle job number and `gggggg` is the git commit reference.

### Rolling back the application

* <em>Requires CLI tools `kubectl` and `helm`</em>
* <em>Requires access to Cloud Platform Kubernetes `live` cluster</em>
* <em>Requires membership of Github team `book-a-prison-visit`</em>

For example in the dev environment:
1. Set the Kube context with command `kubectl config use-context live.cloud-platform.service.justice.gov.uk`
2. Set the Kube namespace with command `kubectl config set-context --current --namespace send-legal-mail-to-prisons-dev`
3. List the charts deployed by helm with command `helm list`
4. List the deployments for this application with command `helm history hmpps-send-legal-mail-staff-ui`
5. Given the application version you wish to rollback to, find the related revision number
6. Rollback to that version with command `helm rollback hmpps-send-legal-mail-staff-ui <revision-number>` replacing `<revision-number>` as appropriate

## Imported Types
Some types are imported from the Open API docs for send-legal-mail-to-prisons-api and prison-register.

To update the types from the Open API docs run the following commands:

`npx openapi-typescript https://send-legal-mail-api-dev.prison.service.justice.gov.uk/v3/api-docs -output send-legal-mail-api.ts > server/@types/sendLegalMailApi/index.d.ts`

`npx openapi-typescript https://prison-register-dev.hmpps.service.justice.gov.uk/v3/api-docs -output prison-register-api.ts > server/@types/prisonRegisterApi/index.d.ts`

Note that you will need to run prettier over the generated files and possibly handle other errors before compiling.

The types are inherited for use in `server/@types/sendLegalMailApiClientTypes/index.d.ts` and `server/@types/prisonRegisterApiClientTypes/index.d.ts` which may also need tweaking for use.

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

Create a `.env` which should override environment variables required to run locally:
```properties
HMPPS_AUTH_URL=http://localhost:9090/auth
HMPPS_MANAGE_USERS_API_URL=https://manage-users-api-dev.hmpps.service.justice.gov.uk
TOKEN_VERIFICATION_API_URL=https://token-verification-api-dev.prison.service.justice.gov.uk
TOKEN_VERIFICATION_ENABLED=false
NODE_ENV=development
SESSION_SECRET=anything
PORT=3000
SEND_LEGAL_MAIL_API_URL=http://localhost:8080
PRISON_REGISTER_API_URL=https://prison-register-dev.hmpps.service.justice.gov.uk
COMPONENT_API_URL=https://frontend-components-dev.hmpps.service.justice.gov.uk
REDIS_HOST=localhost
API_CLIENT_ID=send-legal-mail-to-prisons
SYSTEM_CLIENT_ID=send-legal-mail-to-prisons-client
```

And then, to build the assets and start the app with nodemon:

`npm run start:dev`

### Also running the API for development
This app needs the `send-legal-mail-to-prisons-api` project too which provides the back end for the front end.

See the API Readme for instructions to run the API for development too.

#### How do I sign in as a mailroom staff user?
Visit URL `http://localhost:3000` which should redirect you to the HMPPS Auth sign in page. Enter credentials `SLM_MAILROOM_USER_LOCAL` / `password123456`.

#### How do I sign in as an admin user?
Visit URL `http://localhost:3000` which should redirect you to the HMPPS Auth sign in page. Enter credentials `SLM_ADMIN_LOCAL` / `password123456`.

## Run linter
`npm run lint`

## Run tests
`npm run test`

## Running integration tests
For local running, start a test db, redis, and wiremock instance by:

`docker-compose -f docker-compose-test.yml up`

Then run the server in test mode by:

`npm run start-feature` (or `npm run start-feature:dev` to run with nodemon)

And then either, run tests in headless mode with:

`npm run int-test`

Or run tests with the cypress UI:

`npm run int-test-ui`
