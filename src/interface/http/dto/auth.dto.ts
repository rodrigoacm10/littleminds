import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from '../../../domain';
import { UserResponse } from './user.dto';

export class RegisterData {
  @ApiProperty({ description: 'Nome do usuario', example: 'Joao Silva' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuario', example: 'joao.silva@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuario', example: 'Senha@123' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'Cargo do usuario', enum: Role, required: false, example: Role.PARENT })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class LoginData {
  @ApiProperty({ description: 'E-mail do usuario', example: 'joao.silva@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuario', example: 'Senha@123' })
  @IsString()
  password: string;
}

export class AuthTokenResponse {
  @ApiProperty({ description: 'JWT de acesso', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ description: 'Dados do usuario autenticado', type: UserResponse })
  user: UserResponse;
}

export class LoginResponse {
  @ApiProperty({ description: 'Status da operacao', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados de autenticacao', type: AuthTokenResponse })
  data: AuthTokenResponse;
}
