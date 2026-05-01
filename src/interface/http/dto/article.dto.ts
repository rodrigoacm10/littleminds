import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { AgeGroup } from '../../../domain';

export class CreateArticleData {
  @ApiProperty({ description: 'Título do artigo', example: 'Introdução ao Desenvolvimento Infantil' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Conteúdo do artigo', example: 'O desenvolvimento infantil é um processo...' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'ID do autor do artigo', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  authorId: string;

  @ApiPropertyOptional({ description: 'Resumo do artigo', example: 'Um guia sobre desenvolvimento infantil' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'URL da imagem de capa', example: 'https://example.com/images/capa.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Faixa etária recomendada', enum: AgeGroup, example: AgeGroup.TEENAGER })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;
}

export class UpdateArticleData {
  @ApiPropertyOptional({ description: 'Título do artigo', example: 'Introdução ao Desenvolvimento Infantil' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Conteúdo do artigo', example: 'O desenvolvimento infantil é um processo...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Resumo do artigo', example: 'Um guia sobre desenvolvimento infantil' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: 'URL da imagem de capa', example: 'https://example.com/images/capa.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Faixa etária recomendada', enum: AgeGroup, example: AgeGroup.CHILD })
  @IsOptional()
  @IsEnum(AgeGroup)
  ageGroup?: AgeGroup;

  @ApiPropertyOptional({ description: 'ID do autor do artigo', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  authorId?: string;
}

export class ArticleResponse {
  @ApiProperty({ description: 'ID do artigo', example: 'abc12345-e89b-12d3-a456-426614174001' })
  id: string;

  @ApiProperty({ description: 'Título do artigo', example: 'Introdução ao Desenvolvimento Infantil' })
  title: string;

  @ApiProperty({ description: 'Conteúdo do artigo', example: 'O desenvolvimento infantil é um processo...' })
  content: string;

  @ApiProperty({ description: 'Resumo do artigo', example: 'Um guia sobre desenvolvimento infantil' })
  summary: string;

  @ApiProperty({ description: 'URL da imagem de capa', example: 'https://example.com/images/capa.jpg' })
  coverImage: string;

  @ApiProperty({ description: 'ID do autor', example: '123e4567-e89b-12d3-a456-426614174000' })
  authorId: string;

  @ApiProperty({ description: 'Faixa etária', enum: AgeGroup, example: AgeGroup.TEENAGER })
  ageGroup: AgeGroup;

  @ApiProperty({ description: 'Indica se o artigo está publicado', example: true })
  published: boolean;

  @ApiProperty({ description: 'Data de criação', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2024-01-20T14:45:00Z' })
  updatedAt: Date;
}

export class ArticleListResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Lista de artigos', type: [ArticleResponse] })
  data: ArticleResponse[];
}

export class ArticleSingleResponse {
  @ApiProperty({ description: 'Status da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Dados do artigo', type: ArticleResponse })
  data: ArticleResponse;
}
