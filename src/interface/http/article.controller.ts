import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AgeGroup } from '../../domain';
import {
  CreateArticleUseCase,
  FindArticleByIdUseCase,
  FindAllArticlesUseCase,
  UpdateArticleUseCase,
  PublishArticleUseCase,
  UnpublishArticleUseCase,
  DeleteArticleUseCase,
} from '../../application/use-cases';
import { CreateArticleData, UpdateArticleData, ArticleSingleResponse, ArticleListResponse, ErrorResponse } from './dto';

@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly findArticleByIdUseCase: FindArticleByIdUseCase,
    private readonly findAllArticlesUseCase: FindAllArticlesUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly publishArticleUseCase: PublishArticleUseCase,
    private readonly unpublishArticleUseCase: UnpublishArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo artigo' })
  @ApiBody({ type: CreateArticleData })
  @ApiResponse({ status: 201, description: 'Artigo criado com sucesso', type: ArticleSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateArticleData) {
    const result = await this.createArticleUseCase.execute({
      ...body,
      ageGroup: body.ageGroup as AgeGroup | undefined,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os artigos' })
  @ApiQuery({ name: 'ageGroup', required: false, description: 'Filtrar por faixa etária', enum: AgeGroup })
  @ApiQuery({ name: 'authorId', required: false, description: 'Filtrar por autor', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'published', required: false, description: 'Filtrar por publicados (true/false)', example: 'true' })
  @ApiResponse({ status: 200, description: 'Lista de artigos retornada com sucesso', type: ArticleListResponse })
  async findAll(
    @Query('ageGroup') ageGroup?: string,
    @Query('authorId') authorId?: string,
    @Query('published') published?: string,
  ) {
    const result = await this.findAllArticlesUseCase.execute({
      ageGroup: ageGroup as AgeGroup | undefined,
      authorId,
      publishedOnly: published === 'true',
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar artigo por ID' })
  @ApiParam({ name: 'id', description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiResponse({ status: 200, description: 'Artigo encontrado', type: ArticleSingleResponse })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findArticleByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar artigo' })
  @ApiParam({ name: 'id', description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateArticleData })
  @ApiResponse({ status: 200, description: 'Artigo atualizado com sucesso', type: ArticleSingleResponse })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() body: UpdateArticleData, @Query('requesterId') requesterId?: string) {
    const result = await this.updateArticleUseCase.execute({
      id,
      requesterId: requesterId || body.authorId!,
      title: body.title,
      content: body.content,
      summary: body.summary,
      coverImage: body.coverImage,
      ageGroup: body.ageGroup as AgeGroup | null | undefined,
    });
    return result;
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publicar artigo' })
  @ApiParam({ name: 'id', description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Artigo publicado com sucesso', type: ArticleSingleResponse })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado', type: ErrorResponse })
  async publish(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.publishArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Despublicar artigo' })
  @ApiParam({ name: 'id', description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Artigo despublicado com sucesso', type: ArticleSingleResponse })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado', type: ErrorResponse })
  async unpublish(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.unpublishArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar artigo' })
  @ApiParam({ name: 'id', description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'Artigo deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Artigo não encontrado', type: ErrorResponse })
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}
