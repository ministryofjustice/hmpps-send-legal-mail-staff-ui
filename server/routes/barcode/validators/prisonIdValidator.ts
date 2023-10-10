export default function validatePrisonId(prisonId?: string): Array<string> {
  const errors: Array<string> = []

  if (!prisonId) {
    errors.push('Select a prison name')
  }

  return errors
}
