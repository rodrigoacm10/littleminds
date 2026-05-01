import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum } from 'class-validator';
import { MessageRole } from '../../../domain';

export class CreateMessageData {
  @ApiProperty({ description: 'ID da conversa relacionada', example: 'conv12345-e89b-12d3-a456-426614174003' })
  @IsUUID()
  conversationId: string;

  @ApiProperty({ description: 'Papel do remetente', enum: MessageRole, example: MessageRole.USER })
  @IsEnum(MessageRole)
  role: MessageRole;

  @ApiProperty({ description: 'Conteúdo da mensagem', example: 'Olá, tenho uma dúvida sobre o artigo.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'ID de quem editou a mensagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  editedBy?: string;
}

export class EditMessageData {
  @ApiProperty({ description: 'Novo conteúdo da mensagem', example: 'Conteúdo editado da mensagem.' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'ID de quem editou a mensagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  editedBy?: string;
}

export class MessageResponse {
  @ApiProperty({ description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  id: string;

  @ApiProperty({ description: 'ID da conversa', example: 'conv12345-e89b-12d3-a456-426614174003' })
  conversationId: string;

  @ApiProperty({ description: 'Papel do remetente', enum: MessageRole, example: MessageRole.USER })
  role: MessageRole;

  @ApiProperty({ description: 'Conteúdo da mensagem', example: 'Olá, tenho uma dúvida sobre o artigo.' })
  content: string;

  @ApiProperty({ description: 'Indica se a mensagem foi editada', example: false })
  edited: boolean;

  @ApiProperty({ description: 'ID de quem editou', example: null })
  editedBy: string | null;

  @ApiProperty({ description: 'Indica se a mensagem foi deletada', example: false })
  deleted: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class MessageListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de mensagens', type: [MessageResponse] })
  data: MessageResponse[];
}

export class MessageSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados da mensagem', type: MessageResponse })
  data: MessageResponse;
}
