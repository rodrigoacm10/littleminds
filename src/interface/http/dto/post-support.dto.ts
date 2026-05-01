import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePostSupportData {
  @ApiProperty({ description: 'ID do usuário que está apoiando', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'ID do post apoiado', example: 'forum12345-e89b-12d3-a456-426614174006' })
  @IsUUID()
  postId: string;
}

export class PostSupportResponse {
  @ApiProperty({ description: 'ID do apoio', example: 'support12345-e89b-12d3-a456-426614174007' })
  id: string;

  @ApiProperty({ description: 'ID do usuário', example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  postId: string;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;
}

export class PostSupportListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de apoios', type: [PostSupportResponse] })
  data: PostSupportResponse[];
}

export class PostSupportSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados do apoio', type: PostSupportResponse })
  data: PostSupportResponse;
}

export class CheckUserSupportResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Indica se o usuário apoiou o post', example: true })
  data: {
    supported: boolean;
  };
}
