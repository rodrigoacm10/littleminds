import { Conversation } from './conversation.entity';

describe('Conversation', () => {
  it('creates an active conversation with trimmed title', () => {
    const conversation = Conversation.create('conversation-1', 'user-1', ' Minha conversa ');

    expect(conversation).not.toBeNull();
    expect(conversation?.title).toBe('Minha conversa');
    expect(conversation?.isActive()).toBe(true);
  });

  it('updates title and archive state', () => {
    const conversation = Conversation.create(
      'conversation-1',
      'user-1',
      'Minha conversa',
    ) as Conversation;

    expect(conversation.updateTitle(' Novo título ')).toBe(true);
    expect(conversation.title).toBe('Novo título');

    conversation.archive();
    expect(conversation.isArchived).toBe(true);
    expect(conversation.isActive()).toBe(false);

    conversation.unarchive();
    expect(conversation.isArchived).toBe(false);
    expect(conversation.isActive()).toBe(true);
  });

  it('checks ownership and rejects invalid title update', () => {
    const conversation = Conversation.create(
      'conversation-1',
      'user-1',
      'Minha conversa',
    ) as Conversation;

    expect(conversation.belongsToUser('user-1')).toBe(true);
    expect(conversation.belongsToUser('other-user')).toBe(false);
    expect(conversation.updateTitle('   ')).toBe(false);
  });
});
