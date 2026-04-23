import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
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
  async findOne(@Param('id') id: string) {
    const result = await this.findArticleByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
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
  async publish(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.publishArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.unpublishArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteArticleUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}

interface CreateArticleData {
  title: string;
  content: string;
  authorId: string;
  summary?: string;
  coverImage?: string;
  ageGroup?: string;
}

interface UpdateArticleData {
  title?: string;
  content?: string;
  summary?: string;
  coverImage?: string;
  ageGroup?: string;
  authorId?: string;
}
