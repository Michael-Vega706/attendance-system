import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  status() {
    return { status: 'UP!' };
  }
}
