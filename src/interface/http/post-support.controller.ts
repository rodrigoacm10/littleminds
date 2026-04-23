import { Controller, Get, Post, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import {
  CreatePostSupportUseCase,
  FindPostSupportsByPostUseCase,
  DeletePostSupportUseCase,
  CheckUserSupportUseCase,
} from '../../application/use-cases';

@Controller('post-supports')
export class PostSupportController {
  constructor(
    private readonly createPostSupportUseCase: CreatePostSupportUseCase,
    private readonly findPostSupportsByPostUseCase: FindPostSupportsByPostUseCase,
    private readonly deletePostSupportUseCase: DeletePostSupportUseCase,
    private readonly checkUserSupportUseCase: CheckUserSupportUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreatePostSupportData) {
    const result = await this.createPostSupportUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  async findByPost(@Query('postId') postId: string) {
    const result = await this.findPostSupportsByPostUseCase.execute({ postId });
    return result;
  }

  @Get('check')
  async checkUserSupport(@Query('userId') userId: string, @Query('postId') postId: string) {
    const result = await this.checkUserSupportUseCase.execute({ userId, postId });
    return result;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Query('userId') userId: string, @Query('postId') postId: string) {
    const result = await this.deletePostSupportUseCase.execute({ userId, postId });
    return result;
  }
}

interface CreatePostSupportData {
  userId: string;
  postId: string;
}
