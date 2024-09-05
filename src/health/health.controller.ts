import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { healthApiResponse } from './health.swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiResponse(healthApiResponse)
  checkHealth() {
    return { status: 'ok' };
  }
}
