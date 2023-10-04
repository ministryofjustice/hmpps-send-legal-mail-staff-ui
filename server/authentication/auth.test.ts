import { SessionData } from 'express-session'
import { NextFunction, Request, Response } from 'express'
import auth from './auth'
import tokenVerifier from '../data/tokenVerification'

const req = {
  session: {} as SessionData,
  isAuthenticated: jest.fn(),
  query: {} as Record<string, unknown>,
  originalUrl: 'some-original-url',
  user: { authSource: 'some-authsource' },
}
const res = {
  redirect: jest.fn(),
  locals: {},
}
const next = jest.fn()

jest.mock('../data/tokenVerification')
const verifyToken = tokenVerifier as jest.Mock

describe('authenticationMiddleware', () => {
  const authenticationMiddleware = auth.authenticationMiddleware(tokenVerifier)

  afterEach(() => {
    jest.resetAllMocks()
    req.session = {} as SessionData
    res.locals = {}
    req.user = { authSource: 'some-authsource' }
  })

  describe('authentication', () => {
    it('should continue for authenticated user', async () => {
      req.isAuthenticated.mockReturnValue(true)
      verifyToken.mockResolvedValue(true)

      await authenticationMiddleware(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      expect(req.isAuthenticated).toHaveBeenCalled()
      expect(verifyToken).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
      expect(res.redirect).not.toHaveBeenCalled()
    })

    it('should redirect if not authenticated', async () => {
      req.isAuthenticated.mockReturnValue(false)

      await authenticationMiddleware(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      expect(next).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/sign-in')
      expect(req.session.returnTo).toEqual('some-original-url')
    })

    it('should redirect if token invalid', async () => {
      req.isAuthenticated.mockReturnValue(true)
      verifyToken.mockResolvedValue(false)

      await authenticationMiddleware(
        req as undefined as Request,
        res as undefined as Response,
        next as undefined as NextFunction,
      )

      expect(next).not.toHaveBeenCalled()
      expect(res.redirect).toHaveBeenCalledWith('/sign-in')
    })
  })
})
