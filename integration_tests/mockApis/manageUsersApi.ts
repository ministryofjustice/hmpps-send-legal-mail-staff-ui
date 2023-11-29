import { stubFor } from './wiremock'
import { UserRole } from '../../server/data/manageUsersApiClient'

const stubUser = (name: string = 'john smith') =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/users/me',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        activeCaseLoadId: 'MDI',
        authSource: 'nomis',
        staffId: 231232,
        userId: 231232,
        username: 'USER1',
        active: true,
        name,
        uuid: '5105a589-75b3-4ca0-9433-b96228c1c8f3',
      },
    },
  })

const stubUserRoles = (roles: UserRole[] = [{ roleCode: 'SOME_USER_ROLE' }]) =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: '/manage-users-api/users/me/roles',
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: roles,
    },
  })

export default {
  stubManageUser: stubUser,
  stubManageUserRoles: stubUserRoles,
}
