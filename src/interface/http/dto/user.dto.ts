import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from '../../../domain';

export class CreateUserData {
  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao.silva@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'Senha@123' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'Cargo do usuário', enum: Role, example: Role.PARENT })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UpdateUserData {
  @ApiPropertyOptional({ description: 'Nome do usuário', example: 'João Silva' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'E-mail do usuário', example: 'joao.silva@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Nova senha do usuário', example: 'NovaSenha@123' })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ description: 'Cargo do usuário', enum: Role, example: Role.SPECIALIST })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class UserResponse {
  @ApiProperty({ description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário', example: 'João Silva' })
  name: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao.silva@example.com' })
  email: string;

  @ApiProperty({ description: 'Cargo do usuário', enum: Role, example: Role.PARENT })
  role: Role;

  @ApiProperty({ description: 'Data de criação do usuário', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do usuário', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class UserListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de usuários', type: [UserResponse] })
  data: UserResponse[];
}

export class UserSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados do usuário', type: UserResponse })
  data: UserResponse;
}

export class ErrorResponse {
  @ApiProperty({ description: 'Status da operação', example: false })
  success: boolean;

  @ApiProperty({ description: 'Mensagem de erro', example: 'User not found' })
  error: string;
}
