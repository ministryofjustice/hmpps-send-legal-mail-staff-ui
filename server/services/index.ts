import { TelemetryClient } from 'applicationinsights'
import { dataAccess } from '../data'
import UserService from './userService'
import PrisonService from './prison/PrisonService'
import ScanBarcodeService from './scan/ScanBarcodeService'
import PrisonRegisterService from './prison/PrisonRegisterService'
import PrisonRegisterStore from '../data/cache/PrisonRegisterStore'
import SupportedPrisonsService from './prison/SupportedPrisonsService'
import AppInsightsService from './AppInsightsService'
import { buildAppInsightsClient } from '../utils/azureAppInsights'
import SmokeTestStore from '../data/cache/SmokeTestStore'

export const services = () => {
  const { hmppsAuthClient, manageUsersApiClient, redisClient, applicationInfo } = dataAccess()
  const appInsightsTelemetryClient: TelemetryClient = buildAppInsightsClient(applicationInfo)
  const userService = new UserService(manageUsersApiClient)
  const scanBarcodeService = new ScanBarcodeService(hmppsAuthClient)
  const prisonService = new PrisonService(
    new PrisonRegisterService(new PrisonRegisterStore(redisClient)),
    new SupportedPrisonsService(),
  )
  const appInsightsService = new AppInsightsService(appInsightsTelemetryClient)
  const smokeTestStore = new SmokeTestStore(redisClient)

  return {
    applicationInfo,
    userService,
    scanBarcodeService,
    prisonService,
    appInsightsService,
    smokeTestStore,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
