import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { ApiKey, ApiKeyRole } from '../entities/api-key.entity';
import { Session } from '../../session/entities/session.entity';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    @InjectDataSource('data')
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { apiKey?: ApiKey }>();
    const apiKey = request.apiKey;

    if (!apiKey || apiKey.role !== ApiKeyRole.CUSTOMER) {
      return true;
    }

    const sessionId = (request.params['sessionId'] || request.params['id']) as string | undefined;
    if (!sessionId) {
      return true;
    }

    const session = await this.dataSource.getRepository(Session).findOne({ where: { id: sessionId } });
    if (!session) {
      return true;
    }

    if (session.ownerApiKeyId !== apiKey.id) {
      throw new ForbiddenException('You are not authorized to access this session');
    }

    return true;
  }
}
