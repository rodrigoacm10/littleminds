import { Controller, Get, Post, Delete, Body, Query, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreatePostSupportUseCase,
  FindPostSupportsByPostUseCase,
  DeletePostSupportUseCase,
  CheckUserSupportUseCase,
} from '../../application/use-cases';
import { CreatePostSupportData, PostSupportSingleResponse, PostSupportListResponse, CheckUserSupportResponse, ErrorResponse } from './dto';
import { AuthenticatedRequest, JwtAuthGuard } from '../security';

@ApiTags('PostSupports')
@Controller('post-supports')
export class PostSupportController {
  constructor(
    private readonly createPostSupportUseCase: CreatePostSupportUseCase,
    private readonly findPostSupportsByPostUseCase: FindPostSupportsByPostUseCase,
    private readonly deletePostSupportUseCase: DeletePostSupportUseCase,
    private readonly checkUserSupportUseCase: CheckUserSupportUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo apoio em post' })
  @ApiBody({ type: CreatePostSupportData })
  @ApiResponse({ status: 201, description: 'Apoio criado com sucesso', type: PostSupportSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreatePostSupportData, @Req() request: AuthenticatedRequest) {
    const result = await this.createPostSupportUseCase.execute({
      userId: request.user.id,
      postId: body.postId,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar apoios de um post' })
  @ApiQuery({ name: 'postId', required: true, description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiResponse({ status: 200, description: 'Lista de apoios retornada com sucesso', type: PostSupportListResponse })
  async findByPost(@Query('postId') postId: string) {
    const result = await this.findPostSupportsByPostUseCase.execute({ postId });
    return result;
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar se usuário apoiou um post' })
  @ApiQuery({ name: 'postId', required: true, description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiResponse({ status: 200, description: 'Verificação realizada com sucesso', type: CheckUserSupportResponse })
  async checkUserSupport(@Req() request: AuthenticatedRequest, @Query('postId') postId: string) {
    const result = await this.checkUserSupportUseCase.execute({ userId: request.user.id, postId });
    return result;
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover apoio em post' })
  @ApiQuery({ name: 'postId', required: true, description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiResponse({ status: 204, description: 'Apoio removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Apoio não encontrado', type: ErrorResponse })
  async remove(@Req() request: AuthenticatedRequest, @Query('postId') postId: string) {
    const result = await this.deletePostSupportUseCase.execute({ userId: request.user.id, postId });
    return result;
  }
}
