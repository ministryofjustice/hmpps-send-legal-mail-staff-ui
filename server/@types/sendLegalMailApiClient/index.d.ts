declare module 'sendLegalMailApiClient' {
  import { components } from '../sendLegalMailApi'

  export type ErrorResponse = components['schemas']['ErrorResponse']
  export type ErrorCode = components['schemas']['ErrorCode']

  export type DuplicateErrorCode = components['schemas']['Duplicate']
  export type RandomCheckErrorCode = components['schemas']['RandomCheck']

  export type CheckBarcodeRequest = components['schemas']['CheckBarcodeRequest']
  export type CheckBarcodeResponse = components['schemas']['CheckBarcodeResponse']

  export type Contact = components['schemas']['ContactResponse']

  export type SupportedPrisons = components['schemas']['SupportedPrisons']
}
