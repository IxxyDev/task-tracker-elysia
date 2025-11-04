import { HttpStatus } from '../constants/http.consts';

export function mapErrorToHttpStatus(error: string): number {
  const lowerError = error.toLowerCase();

  if (lowerError.includes('not found') || lowerError.includes('does not exist')) {
    return HttpStatus.NOT_FOUND;
  }

  if (
    lowerError.includes('invalid') ||
    lowerError.includes('cannot') ||
    lowerError.includes('must') ||
    lowerError.includes('required') ||
    lowerError.includes('empty') ||
    lowerError.includes('exceed')
  ) {
    return HttpStatus.BAD_REQUEST;
  }

  return HttpStatus.INTERNAL_SERVER_ERROR;
}
