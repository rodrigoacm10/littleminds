import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { MessageRole } from '../../../domain';

export class CreateConversationData {
  @ApiProperty({ description: 'Título da conversa', example: 'Dúvidas sobre desenvolvimento infantil' })
  @IsString()
  title: string;
}

export class UpdateConversationTitleData {
  @ApiProperty({ description: 'Novo título da conversa', example: 'Novo título da conversa' })
  @IsString()
  title: string;
}

export class ConversationResponse {
  @ApiProperty({ description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  id: string;

  @ApiProperty({ description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'Título da conversa', example: 'Dúvidas sobre desenvolvimento infantil' })
  title: string;

  @ApiProperty({ description: 'Indica se a conversa está arquivada', example: false })
  isArchived: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class ConversationListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de conversas', type: [ConversationResponse] })
  conversations: ConversationResponse[];
}

export class SendMessageToConversationData {
  @ApiProperty({ description: 'Conteudo da mensagem do usuario', example: 'Meu filho esta com dificuldade para dormir, o que posso observar primeiro?' })
  @IsString()
  content: string;
}

export class ChatMessageResponse {
  @ApiProperty({ description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  id: string;

  @ApiProperty({ description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  conversationId: string;

  @ApiProperty({ description: 'Papel do remetente', enum: MessageRole, example: MessageRole.USER })
  role: MessageRole;

  @ApiProperty({ description: 'Conteudo da mensagem', example: 'Meu filho esta com dificuldade para dormir.' })
  content: string;

  @ApiProperty({ description: 'Indica se a mensagem foi deletada', example: false })
  isDeleted: boolean;

  @ApiProperty({ description: 'Data de criacao', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}

export class ConversationWithMessagesResponse extends ConversationResponse {
  @ApiProperty({ description: 'Mensagens da conversa', type: [ChatMessageResponse] })
  messages: ChatMessageResponse[];
}

export class ConversationSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Conversa retornada', type: ConversationResponse })
  conversation: ConversationResponse;
}

export class ConversationDetailResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Conversa encontrada', type: ConversationWithMessagesResponse })
  conversation: ConversationWithMessagesResponse;
}

export class SendMessageToConversationResponse {
  @ApiProperty({ description: 'Status da operacao', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensagem enviada pelo usuario', type: ChatMessageResponse })
  userMessage: ChatMessageResponse;

  @ApiProperty({ description: 'Resposta gerada pela IA', type: ChatMessageResponse })
  assistantMessage: ChatMessageResponse;
}
