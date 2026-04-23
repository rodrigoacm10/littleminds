import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import {
  CreateCommentUseCase,
  FindCommentByIdUseCase,
  FindAllCommentsUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
} from '../../application/use-cases';

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
  async create(@Body() body: CreateCommentData) {
    const result = await this.createCommentUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  async findAll(@Query('postId') postId?: string) {
    const result = await this.findAllCommentsUseCase.execute({ postId });
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findCommentByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
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
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteCommentUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}

interface CreateCommentData {
  content: string;
  postId: string;
  authorId: string;
}

interface UpdateCommentData {
  content?: string;
  authorId?: string;
}
