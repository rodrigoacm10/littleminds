import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import {
  CreateConversationUseCase,
  FindConversationByIdUseCase,
  FindAllConversationsUseCase,
  UpdateConversationTitleUseCase,
  ArchiveConversationUseCase,
  UnarchiveConversationUseCase,
  DeleteConversationUseCase,
} from '../../application/use-cases';
import { CreateConversationData, UpdateConversationTitleData, ConversationSingleResponse, ConversationListResponse, ErrorResponse } from './dto';

@ApiTags('Conversations')
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly createConversationUseCase: CreateConversationUseCase,
    private readonly findConversationByIdUseCase: FindConversationByIdUseCase,
    private readonly findAllConversationsUseCase: FindAllConversationsUseCase,
    private readonly updateConversationTitleUseCase: UpdateConversationTitleUseCase,
    private readonly archiveConversationUseCase: ArchiveConversationUseCase,
    private readonly unarchiveConversationUseCase: UnarchiveConversationUseCase,
    private readonly deleteConversationUseCase: DeleteConversationUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova conversa' })
  @ApiBody({ type: CreateConversationData })
  @ApiResponse({ status: 201, description: 'Conversa criada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateConversationData) {
    const result = await this.createConversationUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Listar conversas de um usuário' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiQuery({ name: 'archived', required: false, description: 'Filtrar por arquivadas (true/false)', example: 'false' })
  @ApiResponse({ status: 200, description: 'Lista de conversas retornada com sucesso', type: ConversationListResponse })
  async findAll(@Query('userId') userId: string, @Query('archived') archived?: string) {
    const result = await this.findAllConversationsUseCase.execute({
      userId,
      archivedOnly: archived === 'true',
    });
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar conversa por ID' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 200, description: 'Conversa encontrada', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async findOne(@Param('id') id: string) {
    const result = await this.findConversationByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id/title')
  @ApiOperation({ summary: 'Atualizar título da conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiBody({ type: UpdateConversationTitleData })
  @ApiResponse({ status: 200, description: 'Título atualizado com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async updateTitle(@Param('id') id: string, @Body() body: UpdateConversationTitleData, @Query('requesterId') requesterId?: string) {
    const result = await this.updateConversationTitleUseCase.execute({
      id,
      requesterId: requesterId || body.userId!,
      title: body.title,
    });
    return result;
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arquivar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Conversa arquivada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async archive(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.archiveConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desarquivar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 200, description: 'Conversa desarquivada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async unarchive(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.unarchiveConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiQuery({ name: 'requesterId', required: false, description: 'ID de quem está fazendo a requisição', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'Conversa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}
