import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { AgeGroup } from '../../domain';
import {
  CreateForumPostUseCase,
  FindForumPostByIdUseCase,
  FindAllForumPostsUseCase,
  UpdateForumPostUseCase,
  DeleteForumPostUseCase,
} from '../../application/use-cases';

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
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateForumPostData) {
    const result = await this.createForumPostUseCase.execute({
      ...body,
      ageGroup: body.ageGroup as AgeGroup | undefined,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  async findAll(@Query('ageGroup') ageGroup?: string, @Query('authorId') authorId?: string) {
    const result = await this.findAllForumPostsUseCase.execute({
      ageGroup: ageGroup as AgeGroup | undefined,
      authorId,
    });
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findForumPostByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateForumPostData, @Query('requesterId') requesterId?: string) {
    const result = await this.updateForumPostUseCase.execute({
      id,
      requesterId: requesterId || body.authorId!,
      title: body.title,
      content: body.content,
      ageGroup: body.ageGroup as AgeGroup | undefined,
    });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteForumPostUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}

interface CreateForumPostData {
  title: string;
  content: string;
  authorId: string;
  ageGroup?: string;
}

interface UpdateForumPostData {
  title?: string;
  content?: string;
  ageGroup?: string;
  authorId?: string;
}
