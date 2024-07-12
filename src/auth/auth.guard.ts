import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLE_KEYS } from 'src/common/decorator/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.getMetadataStatus(context, IS_PUBLIC_KEY);

    if (isPublic) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      const roleAuthorization = ROLE_KEYS.some(({ key }) =>
        this.getMetadataStatus(context, key),
      );

      const roleAuthorized = ROLE_KEYS.reduce<boolean>(
        (prev, { key, value }) => {
          if (this.getMetadataStatus(context, key)) {
            if (payload.user.role === value) return true;
          }

          return prev;
        },
        false,
      );

      if (roleAuthorization && !roleAuthorized) {
        return false;
      }

      payload.user.password = '';
      request['user'] = payload.user;
    } catch (e: any){
      throw new ForbiddenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private getMetadataStatus(context: ExecutionContext, metadata: string) {
    return this.reflector.getAllAndOverride<boolean>(metadata, [
      context.getHandler(),
      context.getClass(),
    ]);
  }
}
