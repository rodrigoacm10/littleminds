import { FindAllMessageVersionsUseCase } from './find-all-message-versions.use-case';
import { MessageVersion, type MessageVersionRepository } from '../../../domain';

describe('FindAllMessageVersionsUseCase', () => {
  const makeMessageVersionRepository = (): jest.Mocked<MessageVersionRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    findLatestByMessageId: jest.fn(),
    delete: jest.fn(),
  });

  it('returns NO_VERSIONS_FOUND when message has no versions', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    messageVersionRepository.findByMessageId.mockResolvedValue([]);

    const sut = new FindAllMessageVersionsUseCase(messageVersionRepository);

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toEqual({
      success: false,
      error: 'NO_VERSIONS_FOUND',
    });
  });

  it('returns all versions when they exist', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    messageVersionRepository.findByMessageId.mockResolvedValue([
      MessageVersion.reconstitute(
        'version-1',
        'message-1',
        'Texto 1',
        'user',
        new Date('2024-01-01T00:00:00.000Z'),
      ),
      MessageVersion.reconstitute(
        'version-2',
        'message-1',
        'Texto 2',
        'system',
        new Date('2024-01-01T00:01:00.000Z'),
      ),
    ]);

    const sut = new FindAllMessageVersionsUseCase(messageVersionRepository);

    const result = await sut.execute({ messageId: 'message-1' });

    expect(result).toMatchObject({
      success: true,
      versions: [
        { id: 'version-1', content: 'Texto 1' },
        { id: 'version-2', content: 'Texto 2' },
      ],
    });
  });
});
