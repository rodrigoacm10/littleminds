import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus, HttpCode } from '@nestjs/common';
import { Role } from '../../domain';
import {
  CreateUserUseCase,
  FindUserByIdUseCase,
  FindUserByEmailUseCase,
  FindAllUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '../../application/use-cases';

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
  async findAll() {
    const result = await this.findAllUsersUseCase.execute({});
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findUserByIdUseCase.execute({ id });
    return result;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const result = await this.findUserByEmailUseCase.execute({ email });
    return result;
  }

  @Put(':id')
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
  async remove(@Param('id') id: string) {
    const result = await this.deleteUserUseCase.execute({ id });
    return result;
  }
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}
