import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  CreateCommentUseCase,
  FindCommentByIdUseCase,
  FindAllCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
} from '../../application/use-cases';
import { CreateCommentData, UpdateCommentData, CommentSingleResponse, CommentListResponse, ErrorResponse } from './dto';

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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo comentário' })
  @ApiBody({ type: CreateCommentData })
  @ApiResponse({ status: 201, description: 'Comentário criado com sucesso', type: CommentSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateCommentData) {
    const result = await this.createCommentUseCase.execute(body);
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
  @ApiOperation({ summary: 'Atualizar comentário' })
  @ApiParam({ name: 'id', description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateCommentData })
  @ApiResponse({ status: 200, description: 'Comentário atualizado com sucesso', type: CommentSingleResponse })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() body: UpdateCommentData, @Query('requesterId') requesterId?: string) {
    const result = await this.updateCommentUseCase.execute({
      id,
      requesterId: requesterId || body.authorId!,
      content: body.content!,
    });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar comentário' })
  @ApiParam({ name: 'id', description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'Comentário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Comentário não encontrado', type: ErrorResponse })
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteCommentUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}
