import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCommentData {
  @ApiProperty({ description: 'Conteúdo do comentário', example: 'Excelente artigo! Muito informativo.' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID do post relacionado', example: 'abc12345-e89b-12d3-a456-426614174001' })
  @IsUUID()
  postId: string;

  @ApiProperty({ description: 'ID do autor do comentário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  authorId: string;
}

export class UpdateCommentData {
  @ApiPropertyOptional({ description: 'Novo conteúdo do comentário', example: 'Comentário editado.' })
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'ID do autor do comentário', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  authorId?: string;
}

export class CommentResponse {
  @ApiProperty({ description: 'ID do comentário', example: 'comment123-e89b-12d3-a456-426614174002' })
  id: string;

  @ApiProperty({ description: 'Conteúdo do comentário', example: 'Excelente artigo! Muito informativo.' })
  content: string;

  @ApiProperty({ description: 'ID do post relacionado', example: 'abc12345-e89b-12d3-a456-426614174001' })
  postId: string;

  @ApiProperty({ description: 'ID do autor', example: '123e4567-e89b-12d3-a456-426614174000' })
  authorId: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class CommentListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de comentários', type: [CommentResponse] })
  data: CommentResponse[];
}

export class CommentSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados do comentário', type: CommentResponse })
  data: CommentResponse;
}
