import { convertToTitleCase } from '../utils/utils'
import ManageUsersApiClient from '../data/manageUsersApiClient'

interface UserDetails {
  name: string
  displayName: string
  username: string
  activeCaseLoadId: string
}

export default class UserService {
  constructor(private readonly manageUsersApiClient: ManageUsersApiClient) {}

  async getUser(token: string): Promise<UserDetails> {
    const user = await this.manageUsersApiClient.getUser(token)
    return { ...user, displayName: convertToTitleCase(user.name) }
  }
}
