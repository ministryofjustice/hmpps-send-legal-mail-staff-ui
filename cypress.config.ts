import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import tokenVerification from './integration_tests/mockApis/tokenVerification'

export default defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
  },
  taskTimeout: 60000,
  downloadsFolder: 'integration_tests/downloads',
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        reset: resetStubs,

        getSignInUrl: auth.getSignInUrl,
        stubSignIn: () => auth.stubSignIn([]),
        stubSignInWithRole_SLM_SCAN_BARCODE: () => auth.stubSignIn(['ROLE_SLM_SCAN_BARCODE']),
        stubSignInWithRole_SLM_ADMIN: () => auth.stubSignIn(['ROLE_SLM_ADMIN']),

        stubAuthUser: auth.stubUser,
        stubAuthPing: auth.stubPing,
        stubAuthToken: auth.stubToken,

        stubTokenVerificationPing: tokenVerification.stubTokenVerificationPing,
        stubVerifyToken: tokenVerification.stubVerifyToken,
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/**/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
    experimentalRunAllSpecs: true,
  },
})
