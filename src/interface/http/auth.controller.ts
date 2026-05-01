import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  LoginUseCase,
  RegisterUseCase,
} from '../../application/use-cases';
import {
  ErrorResponse,
  LoginData,
  LoginResponse,
  RegisterData,
  UserSingleResponse,
} from './dto';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { AuthenticatedRequest } from '../security/authenticated-request.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar um novo usuario' })
  @ApiBody({ type: RegisterData })
  @ApiResponse({ status: 201, description: 'Usuario registrado com sucesso', type: UserSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados invalidos', type: ErrorResponse })
  async register(@Body() body: RegisterData) {
    const result = await this.registerUseCase.execute(body);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      data: result.user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuario e emitir JWT' })
  @ApiBody({ type: LoginData })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso', type: LoginResponse })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas', type: ErrorResponse })
  async login(@Body() body: LoginData) {
    const result = await this.loginUseCase.execute(body);

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return {
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retornar o usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Usuario autenticado retornado com sucesso', type: UserSingleResponse })
  @ApiResponse({ status: 401, description: 'Token invalido ou ausente', type: ErrorResponse })
  async me(@Req() request: AuthenticatedRequest) {
    return {
      success: true,
      data: request.user,
    };
  }
}
