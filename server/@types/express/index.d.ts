import { BarcodeEntryForm } from '../forms'

export default {}

declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    barcodeEntryForm: BarcodeEntryForm
    scannedAtLeastOneBarcode: boolean
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      logout(done: (err: unknown) => void): void
      flash(type: string, message: Array<Record<string, string>>): number
      flash(message: 'errors'): Array<Record<string, string>>
      id: string
    }

    interface Response {
      renderPDF(view: string, pageData: Record<string, unknown>, options?: Record<string, unknown>): void
    }
  }
}
