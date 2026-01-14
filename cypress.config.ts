import { defineConfig } from 'cypress'
import { resetStubs } from './integration_tests/mockApis/wiremock'
import auth from './integration_tests/mockApis/auth'
import manageUsersApi from './integration_tests/mockApis/manageUsersApi'
import tokenVerification from './integration_tests/mockApis/tokenVerification'
import prisonRegister from './integration_tests/mockApis/sendLegalMail/prisonRegister'
import slmPing from './integration_tests/mockApis/sendLegalMail/healthPing'
import barcode from './integration_tests/mockApis/sendLegalMail/barcode'
import supportedPrisons from './integration_tests/mockApis/supportedPrisons'
import dpsComponents from './integration_tests/mockApis/dpsComponents'

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
        stubSignIn: () => auth.stubSignIn(['ROLE_SLM_SCAN_BARCODE']),
        stubSignInWithRole_SLM_SCAN_BARCODE: () => auth.stubSignIn(['ROLE_SLM_SCAN_BARCODE']),
        stubSignInWithRole_SLM_ADMIN: () => auth.stubSignIn(['ROLE_SLM_ADMIN']),

        stubManageUser: manageUsersApi.stubManageUser,
        stubManageUsersPing: manageUsersApi.stubPing,
        stubAuthPing: auth.stubPing,
        stubAuthToken: auth.stubToken,
        stubDpsComponentsFail: dpsComponents.stubDpsComponentsFail,
        stubTokenVerificationPing: tokenVerification.stubTokenVerificationPing,
        stubVerifyToken: tokenVerification.stubVerifyToken,

        stubVerifyValidBarcode: barcode.stubVerifyValidBarcode,
        stubVerifyDuplicateBarcode: barcode.stubVerifyDuplicateBarcode,
        stubVerifyRandomCheckBarcode: barcode.stubVerifyRandomCheckBarcode,
        stubVerifyExpiredBarcode: barcode.stubVerifyExpiredBarcode,
        stubVerifyNotFoundBarcode: barcode.stubVerifyNotFoundBarcode,
        stubMoreChecksRequestedForBarcode: barcode.stubMoreChecksRequestedForBarcode,
        stubCreateBarcode: barcode.stubCreateBarcode,
        stubCreateBarcodeFailure: barcode.stubCreateBarcodeFailure,

        stubGetSupportedPrisons: supportedPrisons.stubGetSupportedPrisons,

        stubGetPrisonRegister: prisonRegister.stubGetPrisonRegister,
        stubPrisonRegisterPing: prisonRegister.stubPing,
        stubSlmPing: slmPing.stubPing,

        // Log message to console
        log: (message: string) => {
          // eslint-disable-next-line no-console
          console.log(message)
          return null
        },

        // Log table to console
        table: (violationData: Record<string, string>[]) => {
          // eslint-disable-next-line no-console
          console.table(violationData)
          return null
        },
      })
    },
    baseUrl: 'http://localhost:3007',
    excludeSpecPattern: '**/!(*.cy).ts',
    specPattern: 'integration_tests/**/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration_tests/support/index.ts',
    experimentalRunAllSpecs: true,
  },
})
