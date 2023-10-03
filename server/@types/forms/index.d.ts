declare module 'forms' {
  import type { CheckBarcodeErrorCodes } from '../sendLegalMailApiClient'

  export interface BarcodeEntryForm {
    barcode?: string
    createdBy?: string
    errorCode?: CheckBarcodeErrorCodes
    lastScannedBarcode?: string
  }
}
