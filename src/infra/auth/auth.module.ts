import { Global, Module } from '@nestjs/common';
import {
  PASSWORD_HASHER_SERVICE,
  TOKEN_SERVICE,
} from '../../domain';
import { JwtTokenService } from './jwt-token.service';
import { NodePasswordHasherService } from './password-hasher.service';

@Global()
@Module({
  providers: [
    NodePasswordHasherService,
    JwtTokenService,
    {
      provide: PASSWORD_HASHER_SERVICE,
      useExisting: NodePasswordHasherService,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
  ],
  exports: [
    PASSWORD_HASHER_SERVICE,
    TOKEN_SERVICE,
    NodePasswordHasherService,
    JwtTokenService,
  ],
})
export class AuthModule {}
