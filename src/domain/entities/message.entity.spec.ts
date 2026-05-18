import { Message } from './message.entity';
import { MessageRole } from '../enums/message-role.enum';

describe('Message', () => {
  it('creates an active message', () => {
    const message = Message.create('message-1', 'conversation-1', MessageRole.USER);

    expect(message).not.toBeNull();
    expect(message?.isDeleted).toBe(false);
    expect(message?.conversationId).toBe('conversation-1');
  });

  it('deletes and restores message state', () => {
    const message = Message.create(
      'message-1',
      'conversation-1',
      MessageRole.USER,
    ) as Message;

    message.delete();
    expect(message.isDeleted).toBe(true);
    expect(message.isActive()).toBe(false);

    message.restore();
    expect(message.isDeleted).toBe(false);
    expect(message.isActive()).toBe(true);
  });

  it('checks role and conversation ownership helpers', () => {
    const userMessage = Message.create(
      'message-1',
      'conversation-1',
      MessageRole.USER,
    ) as Message;
    const assistantMessage = Message.create(
      'message-2',
      'conversation-1',
      MessageRole.ASSISTANT,
    ) as Message;

    expect(userMessage.isFromUser()).toBe(true);
    expect(assistantMessage.isFromAssistant()).toBe(true);
    expect(userMessage.belongsToConversation('conversation-1')).toBe(true);
    expect(userMessage.belongsToConversation('other-conversation')).toBe(false);
  });
});
