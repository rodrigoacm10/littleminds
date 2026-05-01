import { Controller, Get, Post, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  CreateMessageVersionUseCase,
  FindMessageVersionByIdUseCase,
  FindAllMessageVersionsUseCase,
  FindMessageHistoryUseCase,
  FindCurrentMessageContentUseCase,
  DeleteMessageVersionUseCase,
} from '../../application/use-cases';
import { CreateMessageVersionData, MessageVersionSingleResponse, MessageVersionListResponse, ErrorResponse } from './dto';

@ApiTags('MessageVersions')
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
  @ApiOperation({ summary: 'Criar nova versão de mensagem' })
  @ApiBody({ type: CreateMessageVersionData })
  @ApiResponse({ status: 201, description: 'Versão criada com sucesso', type: MessageVersionSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateMessageVersionData) {
    const result = await this.createMessageVersionUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar versão de mensagem por ID' })
  @ApiParam({ name: 'id', description: 'ID da versão', example: 'ver12345-e89b-12d3-a456-426614174005' })
  @ApiResponse({ status: 200, description: 'Versão encontrada', type: MessageVersionSingleResponse })
  @ApiResponse({ status: 404, description: 'Versão não encontrada', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findMessageVersionByIdUseCase.execute({ id });
    return result;
  }

  @Get('message/:messageId')
  @ApiOperation({ summary: 'Listar todas as versões de uma mensagem' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 200, description: 'Lista de versões retornada com sucesso', type: MessageVersionListResponse })
  async findByMessage(@Param('messageId') messageId: string) {
    const result = await this.findAllMessageVersionsUseCase.execute({ messageId });
    return result;
  }

  @Get('message/:messageId/history')
  @ApiOperation({ summary: 'Buscar histórico de edições de uma mensagem' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso', type: MessageVersionListResponse })
  async findHistory(@Param('messageId') messageId: string) {
    const result = await this.findMessageHistoryUseCase.execute({ messageId });
    return result;
  }

  @Get('message/:messageId/current')
  @ApiOperation({ summary: 'Buscar conteúdo atual da mensagem' })
  @ApiParam({ name: 'messageId', description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @ApiResponse({ status: 200, description: 'Conteúdo atual retornado com sucesso', type: MessageVersionSingleResponse })
  @ApiResponse({ status: 404, description: 'Mensagem não encontrada', type: ErrorResponse })
  async findCurrent(@Param('messageId') messageId: string) {
    const result = await this.findCurrentMessageContentUseCase.execute({ messageId });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar versão de mensagem' })
  @ApiParam({ name: 'id', description: 'ID da versão', example: 'ver12345-e89b-12d3-a456-426614174005' })
  @ApiResponse({ status: 204, description: 'Versão deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Versão não encontrada', type: ErrorResponse })
  async remove(@Param('id') id: string) {
    const result = await this.deleteMessageVersionUseCase.execute({ id });
    return result;
  }
}
