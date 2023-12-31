import type { SupportedPrisons } from 'sendLegalMailApiClient'
import RestClient from '../../data/restClient'
import config from '../../config'

export default class SupportedPrisonsService {
  private static restClient(hmppsToken?: string): RestClient {
    return new RestClient('Send Legal Mail API Client', config.apis.sendLegalMail, hmppsToken, null)
  }

  async getSupportedPrisons(): Promise<SupportedPrisons> {
    return SupportedPrisonsService.restClient().get({ path: '/prisons' })
  }

  async addSupportedPrison(userToken: string, prisonId: string): Promise<unknown> {
    return SupportedPrisonsService.restClient(userToken).post({ path: `/prisons/${prisonId}` })
  }

  async removeSupportedPrison(userToken: string, prisonId: string): Promise<unknown> {
    return SupportedPrisonsService.restClient(userToken).delete({ path: `/prisons/${prisonId}` })
  }
}
