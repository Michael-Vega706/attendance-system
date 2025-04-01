import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';
import { HealthyResponse } from './responses/auth.response';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: HealthyResponse })
  healthyCheck() {
    return this.appService.status();
  }
}
