import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import {
  CreateConversationUseCase,
  FindConversationByIdUseCase,
  FindAllConversationsUseCase,
  UpdateConversationTitleUseCase,
  ArchiveConversationUseCase,
  UnarchiveConversationUseCase,
  DeleteConversationUseCase,
  SendMessageToConversationUseCase,
} from '../../application/use-cases';
import {
  CreateConversationData,
  UpdateConversationTitleData,
  ConversationSingleResponse,
  ConversationListResponse,
  ErrorResponse,
  SendMessageToConversationData,
  SendMessageToConversationResponse,
} from './dto';
import { JwtAuthGuard } from '../security';
import { AuthenticatedRequest } from '../security';

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
    private readonly sendMessageToConversationUseCase: SendMessageToConversationUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar uma nova conversa' })
  @ApiBody({ type: CreateConversationData })
  @ApiResponse({ status: 201, description: 'Conversa criada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 400, description: 'Dados inválidos', type: ErrorResponse })
  async create(@Body() body: CreateConversationData, @Req() request: AuthenticatedRequest) {
    const result = await this.createConversationUseCase.execute({
      userId: request.user.id,
      title: body.title,
    });
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar conversas de um usuário' })
  @ApiQuery({ name: 'archived', required: false, description: 'Filtrar por arquivadas (true/false)', example: 'false' })
  @ApiResponse({ status: 200, description: 'Lista de conversas retornada com sucesso', type: ConversationListResponse })
  async findAll(@Req() request: AuthenticatedRequest, @Query('archived') archived?: string) {
    const result = await this.findAllConversationsUseCase.execute({
      userId: request.user.id,
      archivedOnly: archived === 'true',
    });
    return result;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar conversa por ID' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 200, description: 'Conversa encontrada', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.findConversationByIdUseCase.execute({ id });

    if (result.success && result.conversation?.userId !== request.user.id) {
      throw new ForbiddenException('CONVERSATION_FORBIDDEN');
    }

    return result;
  }

  @Put(':id/title')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar título da conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiBody({ type: UpdateConversationTitleData })
  @ApiResponse({ status: 200, description: 'Título atualizado com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async updateTitle(@Param('id') id: string, @Body() body: UpdateConversationTitleData, @Req() request: AuthenticatedRequest) {
    const result = await this.updateConversationTitleUseCase.execute({
      id,
      requesterId: request.user.id,
      title: body.title,
    });
    return result;
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Arquivar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 200, description: 'Conversa arquivada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async archive(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.archiveConversationUseCase.execute({ id, requesterId: request.user.id });
    return result;
  }

  @Post(':id/unarchive')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desarquivar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 200, description: 'Conversa desarquivada com sucesso', type: ConversationSingleResponse })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async unarchive(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.unarchiveConversationUseCase.execute({ id, requesterId: request.user.id });
    return result;
  }

  @Post(':id/chat')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar mensagem do usuario e receber resposta da IA' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiBody({ type: SendMessageToConversationData })
  @ApiResponse({ status: 201, description: 'Mensagem processada com sucesso', type: SendMessageToConversationResponse })
  @ApiResponse({ status: 404, description: 'Conversa nao encontrada', type: ErrorResponse })
  async chat(@Param('id') id: string, @Body() body: SendMessageToConversationData, @Req() request: AuthenticatedRequest) {
    const result = await this.sendMessageToConversationUseCase.execute({
      conversationId: id,
      userId: request.user.id,
      content: body.content,
    });
    return result;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar conversa' })
  @ApiParam({ name: 'id', description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @ApiResponse({ status: 204, description: 'Conversa deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conversa não encontrada', type: ErrorResponse })
  async remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    const result = await this.deleteConversationUseCase.execute({ id, requesterId: request.user.id });
    return result;
  }
}
