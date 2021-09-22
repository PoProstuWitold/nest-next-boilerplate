import { HttpException, HttpStatus } from '@nestjs/common'

export class UniqueViolation extends HttpException {
    constructor(field: string) {
      super(`Field ${field} already exists`, HttpStatus.BAD_REQUEST)
    }
  }