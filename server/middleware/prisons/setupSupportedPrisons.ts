import express, { Router } from 'express'
import authorisationMiddleware from '../authorisationMiddleware'
import SupportedPrisonsController from '../../routes/prisons/SupportedPrisonsController'
import PrisonService from '../../services/prison/PrisonService'

export default function setupSupportedPrisons(prisonService: PrisonService): Router {
  const router = express.Router()

  const supportedPrisonsController = new SupportedPrisonsController(prisonService)

  router.use('/supported-prisons', authorisationMiddleware(['ROLE_SLM_ADMIN']))
  router.get('/supported-prisons', (req, res) => supportedPrisonsController.getSupportedPrisonsView(req, res))
  router.post('/supported-prisons/add', (req, res) => supportedPrisonsController.addSupportedPrison(req, res))
  router.get('/supported-prisons/remove/:prisonId', (req, res) =>
    supportedPrisonsController.removeSupportedPrison(req, res),
  )

  return router
}
