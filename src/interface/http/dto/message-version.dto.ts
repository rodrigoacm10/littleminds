import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateMessageVersionData {
  @ApiProperty({ description: 'ID da mensagem relacionada', example: 'msg12345-e89b-12d3-a456-426614174004' })
  @IsUUID()
  messageId: string;

  @ApiProperty({ description: 'Novo conteúdo da mensagem', example: 'Conteúdo atualizado da mensagem.' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID de quem editou a mensagem', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  editedBy: string;
}

export class MessageVersionResponse {
  @ApiProperty({ description: 'ID da versão', example: 'ver12345-e89b-12d3-a456-426614174005' })
  id: string;

  @ApiProperty({ description: 'ID da mensagem', example: 'msg12345-e89b-12d3-a456-426614174004' })
  messageId: string;

  @ApiProperty({ description: 'Número da versão', example: 1 })
  versionNumber: number;

  @ApiProperty({ description: 'Conteúdo da versão', example: 'Conteúdo atualizado da mensagem.' })
  content: string;

  @ApiProperty({ description: 'ID de quem editou', example: '123e4567-e89b-12d3-a456-426614174000' })
  editedBy: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}

export class MessageVersionListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de versões', type: [MessageVersionResponse] })
  data: MessageVersionResponse[];
}

export class MessageVersionSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados da versão', type: MessageVersionResponse })
  data: MessageVersionResponse;
}
