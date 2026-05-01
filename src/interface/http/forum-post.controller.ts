import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AgeGroup } from '../../domain';
import {
  CreateForumPostUseCase,
  FindForumPostByIdUseCase,
  FindAllForumPostsUseCase,
  UpdateForumPostUseCase,
  DeleteForumPostUseCase,
} from '../../application/use-cases';
import { CreateForumPostData, UpdateForumPostData, ForumPostSingleResponse, ForumPostListResponse, ErrorResponse } from './dto';
import { AuthenticatedRequest, JwtAuthGuard } from '../security';

@ApiTags('ForumPosts')
@Controller('forum-posts')
export class ForumPostController {
  constructor(
    private readonly createForumPostUseCase: CreateForumPostUseCase,
    private readonly findForumPostByIdUseCase: FindForumPostByIdUseCase,
    private readonly findAllForumPostsUseCase: FindAllForumPostsUseCase,
    private readonly updateForumPostUseCase: UpdateForumPostUseCase,
    private readonly deleteForumPostUseCase: DeleteForumPostUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo post no fórum' })
  @ApiBody({ type: CreateForumPostData })
  @ApiResponse({ status: 201, description: 'Post criado com sucesso', type: ForumPostSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateForumPostData, @Req() request: AuthenticatedRequest) {
    const result = await this.createForumPostUseCase.execute({
      authorId: request.user.id,
      title: body.title,
      content: body.content,
      ageGroup: body.ageGroup as AgeGroup | undefined,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar posts do fórum' })
  @ApiQuery({ name: 'ageGroup', required: false, description: 'Filtrar por faixa etária', enum: AgeGroup })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filtrar por autor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Lista de posts retornada com sucesso', type: ForumPostListResponse })
  async findAll(@Query('ageGroup') ageGroup?: string, @Query('authorId') authorId?: string) {
    const result = await this.findAllForumPostsUseCase.execute({
      ageGroup: ageGroup as AgeGroup | undefined,
      authorId,
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar post do fórum por ID' })
  @ApiParam({ name: 'id', description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiResponse({ status: 200, description: 'Post encontrado', type: ForumPostSingleResponse })
  @ApiResponse({ status: 404, description: 'Post não encontrado', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findForumPostByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar post do fórum' })
  @ApiParam({ name: 'id', description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiBody({ type: UpdateForumPostData })
  @ApiResponse({ status: 200, description: 'Post atualizado com sucesso', type: ForumPostSingleResponse })
  @ApiResponse({ status: 404, description: 'Post não encontrado', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() body: UpdateForumPostData, @Req() request: AuthenticatedRequest) {
    const result = await this.updateForumPostUseCase.execute({
      id,
      requesterId: request.user.id,
      title: body.title,
      content: body.content,
      ageGroup: body.ageGroup as AgeGroup | undefined,
    });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar post do fórum' })
  @ApiParam({ name: 'id', description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @ApiResponse({ status: 204, description: 'Post deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Post não encontrado', type: ErrorResponse })
  async remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.deleteForumPostUseCase.execute({ id, requesterId: request.user.id });
    return result;
  }
}
