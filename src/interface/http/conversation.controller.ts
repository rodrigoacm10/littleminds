import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpStatus, HttpCode } from '@nestjs/common';
import {
  CreateConversationUseCase,
  FindConversationByIdUseCase,
  FindAllConversationsUseCase,
  UpdateConversationTitleUseCase,
  ArchiveConversationUseCase,
  UnarchiveConversationUseCase,
  DeleteConversationUseCase,
} from '../../application/use-cases';

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
  async create(@Body() body: CreateConversationData) {
    const result = await this.createConversationUseCase.execute(body);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return result;
  }

  @Get()
  async findAll(@Query('userId') userId: string, @Query('archived') archived?: string) {
    const result = await this.findAllConversationsUseCase.execute({
      userId,
      archivedOnly: archived === 'true',
    });
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.findConversationByIdUseCase.execute({ id });
    return result;
  }

  @Put(':id/title')
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
  async archive(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.archiveConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  async unarchive(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.unarchiveConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Query('requesterId') requesterId?: string) {
    const result = await this.deleteConversationUseCase.execute({ id, requesterId: requesterId! });
    return result;
  }
}

interface CreateConversationData {
  userId: string;
  title: string;
}

interface UpdateConversationTitleData {
  title: string;
  userId?: string;
}
