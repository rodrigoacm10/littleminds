import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { AgeGroup } from '../../../domain';

export class CreateForumPostData {
  @ApiProperty({ description: 'Título do post', example: 'Dúvidas sobre alfabetização' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Conteúdo do post', example: 'Gostaria de saber mais sobre métodos de alfabetização...' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID do autor do post', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  authorId: string;

  @ApiPropertyOptional({ description: 'Faixa etária relacionada', enum: AgeGroup, example: AgeGroup.CHILD })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;
}

export class UpdateForumPostData {
  @ApiPropertyOptional({ description: 'Título do post', example: 'Dúvidas sobre alfabetização' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Conteúdo do post', example: 'Gostaria de saber mais sobre métodos de alfabetização...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Faixa etária relacionada', enum: AgeGroup, example: AgeGroup.TEENAGER })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @ApiPropertyOptional({ description: 'ID do autor do post', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}

export class ForumPostResponse {
  @ApiProperty({ description: 'ID do post', example: 'forum12345-e89b-12d3-a456-426614174006' })
  id: string;

  @ApiProperty({ description: 'Título do post', example: 'Dúvidas sobre alfabetização' })
  title: string;

  @ApiProperty({ description: 'Conteúdo do post', example: 'Gostaria de saber mais sobre métodos de alfabetização...' })
  content: string;

  @ApiProperty({ description: 'ID do autor', example: '123e4567-e89b-12d3-a456-426614174000' })
  authorId: string;

  @ApiProperty({ description: 'Faixa etária', enum: AgeGroup, example: AgeGroup.CHILD })
  ageGroup: AgeGroup;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class ForumPostListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de posts', type: [ForumPostResponse] })
  data: ForumPostResponse[];
}

export class ForumPostSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados do post', type: ForumPostResponse })
  data: ForumPostResponse;
}
