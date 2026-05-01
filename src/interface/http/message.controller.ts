import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MessageRole } from '../../domain';
import {
  CreateMessageUseCase,
  FindMessageByIdUseCase,
  FindMessagesByConversationUseCase,
  EditMessageUseCase,
  DeleteMessageUseCase,
  RestoreMessageUseCase,
} from '../../application/use-cases';
import { CreateMessageData, EditMessageData, MessageSingleResponse, MessageListResponse, ErrorResponse } from './dto';

@ApiTags('Messages')
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
  @ApiOperation({ summary: 'Criar uma nova mensagem' })
  @ApiBody({ type: CreateMessageData })
  @ApiResponse({ status: 201, description: 'Mensagem criada com sucesso', type: MessageSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateMessageData) {
    const result = await this.createMessageUseCase.execute({
      conversationId: body.conversationId,
      content: body.content,
      editedBy: body.editedBy,
      role: MessageRole.USER,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar mensagens de uma conversa' })
  @ApiQuery({ name: 'conversationId', required: true, description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 200, description: 'Lista de mensagens retornada com sucesso', type: MessageListResponse })
  async findByConversation(@Query('conversationId') conversationId: string) {
    const result = await this.findMessagesByConversationUseCase.execute({ conversationId });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar mensagem por ID' })
  @ApiParam({ name: 'id', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 200, description: 'Mensagem encontrada', type: MessageSingleResponse })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findMessageByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar mensagem' })
  @ApiParam({ name: 'id', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiBody({ type: EditMessageData })
  @ApiResponse({ status: 200, description: 'Mensagem editada com sucesso', type: MessageSingleResponse })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada', type: ErrorResponse })
  async edit(@Param('id') id: string, @Body() body: EditMessageData) {
    const result = await this.editMessageUseCase.execute({ messageId: id, ...body });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar mensagem' })
  @ApiParam({ name: 'id', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 204, description: 'Mensagem deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada', type: ErrorResponse })
  async remove(@Param('id') id: string) {
    const result = await this.deleteMessageUseCase.execute({ id });
    return result;
  }

  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restaurar mensagem deletada' })
  @ApiParam({ name: 'id', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 200, description: 'Mensagem restaurada com sucesso', type: MessageSingleResponse })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada', type: ErrorResponse })
  async restore(@Param('id') id: string) {
    const result = await this.restoreMessageUseCase.execute({ id });
    return result;
  }
}
