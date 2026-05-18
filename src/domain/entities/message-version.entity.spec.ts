import { MessageVersion } from './message-version.entity';

describe('MessageVersion', () => {
  it('creates an immutable version with trimmed content', () => {
    const version = MessageVersion.create(
      'version-1',
      'message-1',
      ' Conteúdo atualizado ',
      ' user ',
    );

    expect(version).not.toBeNull();
    expect(version?.content).toBe('Conteúdo atualizado');
    expect(version?.editedBy).toBe('user');
  });

  it('checks editor and parent message helpers', () => {
    const userVersion = MessageVersion.create(
      'version-1',
      'message-1',
      'Texto',
      'user',
    ) as MessageVersion;
    const systemVersion = MessageVersion.create(
      'version-2',
      'message-1',
      'Texto 2',
      'system',
    ) as MessageVersion;

    expect(userVersion.isEditedByUser()).toBe(true);
    expect(systemVersion.isEditedBySystem()).toBe(true);
    expect(userVersion.belongsToMessage('message-1')).toBe(true);
    expect(userVersion.belongsToMessage('other-message')).toBe(false);
  });

  it('rejects invalid creation', () => {
    expect(MessageVersion.create('', 'message-1', 'Texto', 'user')).toBeNull();
    expect(MessageVersion.create('version-1', '', 'Texto', 'user')).toBeNull();
    expect(MessageVersion.create('version-1', 'message-1', '   ', 'user')).toBeNull();
    expect(MessageVersion.create('version-1', 'message-1', 'Texto', '   ')).toBeNull();
  });
});
