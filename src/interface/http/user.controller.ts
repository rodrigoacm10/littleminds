import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Role } from '../../domain';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
  FindAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application/use-cases';
import { CreateUserData, UpdateUserData, UserSingleResponse, UserListResponse, ErrorResponse } from './dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiBody({ type: CreateUserData })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateUserData) {
    const result = await this.createUserUseCase.execute({
      ...body,
      role: body.role as Role | undefined,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso', type: UserListResponse })
  async findAll() {
    const result = await this.findAllUsersUseCase.execute({});
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserSingleResponse })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findUserByIdUseCase.execute({ id });
    return result;
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Buscar usuário por e-mail' })
  @ApiParam({ name: 'email', description: 'E-mail do usuário', example: 'joao.silva@example.com' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserSingleResponse })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado', type: ErrorResponse })
  async findByEmail(@Param('email') email: string) {
    const result = await this.findUserByEmailUseCase.execute({ email });
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateUserData })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserSingleResponse })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() body: UpdateUserData) {
    const result = await this.updateUserUseCase.execute({
      id,
      name: body.name,
      email: body.email,
      password: body.password,
    });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado', type: ErrorResponse })
  async remove(@Param('id') id: string) {
    const result = await this.deleteUserUseCase.execute({ id });
    return result;
  }
}
