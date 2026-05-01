import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TOKEN_SERVICE, TokenService, USER_REPOSITORY, UserRepository } from '../../domain';
import { Inject } from '@nestjs/common';
import { AuthenticatedRequest } from './authenticated-request.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('AUTH_TOKEN_MISSING');
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
      const payload = await this.tokenService.verify(token);
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('AUTH_USER_NOT_FOUND');
      }

      request.user = {
        id: user.id,
        name: user.name,
        email: user.email.value,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('AUTH_TOKEN_INVALID');
    }
  }
}
