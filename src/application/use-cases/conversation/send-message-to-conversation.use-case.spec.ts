import { SendMessageToConversationUseCase } from './send-message-to-conversation.use-case';
import {
  Conversation,
  Message,
  MessageRole,
  MessageVersion,
  type AIChatService,
  type ConversationRepository,
  type MessageRepository,
  type MessageVersionRepository,
} from '../../../domain';

describe('SendMessageToConversationUseCase', () => {
  const makeConversationRepository = (): jest.Mocked<ConversationRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByUserId: jest.fn(),
    findActiveByUserId: jest.fn(),
    findArchivedByUserId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeMessageRepository = (): jest.Mocked<MessageRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByConversationId: jest.fn(),
    findByConversationIdAndRole: jest.fn(),
    findLastByConversationId: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  const makeMessageVersionRepository = (): jest.Mocked<MessageVersionRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    findLatestByMessageId: jest.fn(),
    delete: jest.fn(),
  });

  const makeAiChatService = (): jest.Mocked<AIChatService> => ({
    generateReply: jest.fn(),
  });

  const makeConversation = (userId = 'user-1', archived = false) =>
    Conversation.reconstitute(
      'conversation-1',
      userId,
      'Conversa',
      archived,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  const makeHistoryMessage = (id: string, role: MessageRole, createdAt: string, deleted = false) =>
    Message.reconstitute(
      id,
      'conversation-1',
      role,
      deleted,
      new Date(createdAt),
    );

  const makeVersion = (id: string, messageId: string, content: string) =>
    MessageVersion.reconstitute(
      id,
      messageId,
      content,
      'user',
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('returns CONVERSATION_NOT_FOUND when conversation does not exist', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    const aiChatService = makeAiChatService();
    conversationRepository.findById.mockResolvedValue(null);

    const sut = new SendMessageToConversationUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
      aiChatService,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      userId: 'user-1',
      content: 'Oi',
    });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_NOT_FOUND',
    });
  });

  it('returns CONVERSATION_ARCHIVED when conversation is archived', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    const aiChatService = makeAiChatService();
    conversationRepository.findById.mockResolvedValue(makeConversation('user-1', true));

    const sut = new SendMessageToConversationUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
      aiChatService,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      userId: 'user-1',
      content: 'Oi',
    });

    expect(result).toEqual({
      success: false,
      error: 'CONVERSATION_ARCHIVED',
    });
  });

  it('returns AI_RESPONSE_FAILED when AI generation throws', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    const aiChatService = makeAiChatService();

    conversationRepository.findById.mockResolvedValue(makeConversation());
    messageRepository.findByConversationId.mockResolvedValue([
      makeHistoryMessage('user-message-1', MessageRole.USER, '2024-01-01T00:00:01.000Z'),
    ]);
    messageVersionRepository.findLatestByMessageId.mockResolvedValue(
      makeVersion('version-1', 'user-message-1', 'Mensagem anterior'),
    );
    aiChatService.generateReply.mockRejectedValue(new Error('AI down'));

    const sut = new SendMessageToConversationUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
      aiChatService,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      userId: 'user-1',
      content: 'Mensagem nova',
    });

    expect(result).toEqual({
      success: false,
      error: 'AI_RESPONSE_FAILED',
    });
    expect(messageRepository.save).toHaveBeenCalledTimes(1);
    expect(messageVersionRepository.save).toHaveBeenCalledTimes(1);
  });

  it('creates user and assistant messages in chronological context order', async () => {
    const conversationRepository = makeConversationRepository();
    const messageRepository = makeMessageRepository();
    const messageVersionRepository = makeMessageVersionRepository();
    const aiChatService = makeAiChatService();

    const deletedAssistant = makeHistoryMessage(
      'assistant-deleted',
      MessageRole.ASSISTANT,
      '2024-01-01T00:00:02.000Z',
      true,
    );
    const firstUser = makeHistoryMessage(
      'user-message-1',
      MessageRole.USER,
      '2024-01-01T00:00:01.000Z',
    );

    conversationRepository.findById.mockResolvedValue(makeConversation());
    messageRepository.findByConversationId.mockResolvedValue([
      deletedAssistant,
      firstUser,
    ]);
    messageVersionRepository.findLatestByMessageId.mockImplementation(async (messageId) => {
      if (messageId === 'user-message-1') {
        return makeVersion('version-1', messageId, 'Primeira mensagem');
      }

      if (messageId === 'assistant-deleted') {
        return makeVersion('version-2', messageId, 'Nao deve entrar no contexto');
      }

      return null;
    });
    aiChatService.generateReply.mockResolvedValue('Resposta da IA');

    const sut = new SendMessageToConversationUseCase(
      conversationRepository,
      messageRepository,
      messageVersionRepository,
      aiChatService,
    );

    const result = await sut.execute({
      conversationId: 'conversation-1',
      userId: 'user-1',
      content: 'Mensagem nova',
    });

    expect(aiChatService.generateReply).toHaveBeenCalledWith([
      {
        role: MessageRole.USER,
        content: 'Primeira mensagem',
      },
    ]);
    expect(messageRepository.save).toHaveBeenCalledTimes(2);
    expect(messageVersionRepository.save).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      success: true,
      userMessage: {
        conversationId: 'conversation-1',
        role: MessageRole.USER,
        content: 'Mensagem nova',
      },
      assistantMessage: {
        conversationId: 'conversation-1',
        role: MessageRole.ASSISTANT,
        content: 'Resposta da IA',
      },
    });
  });
});
