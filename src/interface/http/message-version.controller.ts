import { Controller, Get, Post, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import {
  CreateMessageVersionUseCase,
  FindMessageVersionByIdUseCase,
  FindAllMessageVersionsUseCase,
  FindMessageHistoryUseCase,
  FindCurrentMessageContentUseCase,
  DeleteMessageVersionUseCase,
} from '../../application/use-cases';

@Controller('message-versions')
export class MessageVersionController {
  constructor(
    private readonly createMessageVersionUseCase: CreateMessageVersionUseCase,
    private readonly findMessageVersionByIdUseCase: FindMessageVersionByIdUseCase,
    private readonly findAllMessageVersionsUseCase: FindAllMessageVersionsUseCase,
    private readonly findMessageHistoryUseCase: FindMessageHistoryUseCase,
    private readonly findCurrentMessageContentUseCase: FindCurrentMessageContentUseCase,
    private readonly deleteMessageVersionUseCase: DeleteMessageVersionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMessageVersionData) {
    const result = await this.createMessageVersionUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findMessageVersionByIdUseCase.execute({ id });
    return result;
  }

  @Get('message/:messageId')
  async findByMessage(@Param('messageId') messageId: string) {
    const result = await this.findAllMessageVersionsUseCase.execute({ messageId });
    return result;
  }

  @Get('message/:messageId/history')
  async findHistory(@Param('messageId') messageId: string) {
    const result = await this.findMessageHistoryUseCase.execute({ messageId });
    return result;
  }

  @Get('message/:messageId/current')
  async findCurrent(@Param('messageId') messageId: string) {
    const result = await this.findCurrentMessageContentUseCase.execute({ messageId });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.deleteMessageVersionUseCase.execute({ id });
    return result;
  }
}

interface CreateMessageVersionData {
  messageId: string;
  content: string;
  editedBy: string;
}
