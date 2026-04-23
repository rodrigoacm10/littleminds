import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { MessageRole } from '../../domain';
import {
  CreateMessageUseCase,
  FindMessageByIdUseCase,
  FindMessagesByConversationUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  RestoreMessageUseCase,
} from '../../application/use-cases';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly createMessageUseCase: CreateMessageUseCase,
    private readonly findMessageByIdUseCase: FindMessageByIdUseCase,
    private readonly findMessagesByConversationUseCase: FindMessagesByConversationUseCase,
    private readonly editMessageUseCase: EditMessageUseCase,
    private readonly deleteMessageUseCase: DeleteMessageUseCase,
    private readonly restoreMessageUseCase: RestoreMessageUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateMessageData) {
    const result = await this.createMessageUseCase.execute({
      ...body,
      role: body.role as MessageRole,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  async findByConversation(@Query('conversationId') conversationId: string) {
    const result = await this.findMessagesByConversationUseCase.execute({ conversationId });
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findMessageByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  async edit(@Param('id') id: string, @Body() body: EditMessageData) {
    const result = await this.editMessageUseCase.execute({ messageId: id, ...body });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    const result = await this.deleteMessageUseCase.execute({ id });
    return result;
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  async restore(@Param('id') id: string) {
    const result = await this.restoreMessageUseCase.execute({ id });
    return result;
  }
}

interface CreateMessageData {
  conversationId: string;
  role: string;
  content: string;
  editedBy?: string;
}

interface EditMessageData {
  content: string;
  editedBy?: string;
}
