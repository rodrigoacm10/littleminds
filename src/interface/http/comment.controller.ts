import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateCommentUseCase,
  FindCommentByIdUseCase,
  FindAllCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
} from '../../application/use-cases';
import { CreateCommentData, UpdateCommentData, CommentSingleResponse, CommentListResponse, ErrorResponse } from './dto';
import { AuthenticatedRequest, JwtAuthGuard } from '../security';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly findCommentByIdUseCase: FindCommentByIdUseCase,
    private readonly findAllCommentsUseCase: FindAllCommentsUseCase,
    private readonly updateCommentUseCase: UpdateCommentUseCase,
    private readonly deleteCommentUseCase: DeleteCommentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo comentário' })
  @ApiBody({ type: CreateCommentData })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso', type: CommentSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateCommentData, @Req() request: AuthenticatedRequest) {
    const result = await this.createCommentUseCase.execute({
      authorId: request.user.id,
      content: body.content,
      postId: body.postId,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar comentários' })
  @ApiQuery({ name: 'postId', required: false, description: 'Filtrar por post', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiResponse({ status: 200, description: 'Lista de comentários retornada com sucesso', type: CommentListResponse })
  async findAll(@Query('postId') postId?: string) {
    const result = await this.findAllCommentsUseCase.execute({ postId });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar comentário por ID' })
  @ApiParam({ name: 'id', description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  @ApiResponse({ status: 200, description: 'Comentário encontrado', type: CommentSingleResponse })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findCommentByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar comentário' })
  @ApiParam({ name: 'id', description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  @ApiBody({ type: UpdateCommentData })
  @ApiResponse({ status: 200, description: 'Comentário atualizado com sucesso', type: CommentSingleResponse })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() body: UpdateCommentData, @Req() request: AuthenticatedRequest) {
    const result = await this.updateCommentUseCase.execute({
      id,
      requesterId: request.user.id,
      content: body.content!,
    });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar comentário' })
  @ApiParam({ name: 'id', description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  @ApiResponse({ status: 204, description: 'Comentário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado', type: ErrorResponse })
  async remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.deleteCommentUseCase.execute({ id, requesterId: request.user.id });
    return result;
  }
}
