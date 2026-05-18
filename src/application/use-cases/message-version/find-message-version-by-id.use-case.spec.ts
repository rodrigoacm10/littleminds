import { FindMessageVersionByIdUseCase } from './find-message-version-by-id.use-case';
import { MessageVersion, type MessageVersionRepository } from '../../../domain';

describe('FindMessageVersionByIdUseCase', () => {
  const makeMessageVersionRepository = (): jest.Mocked<MessageVersionRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByMessageId: jest.fn(),
    findLatestByMessageId: jest.fn(),
    delete: jest.fn(),
  });

  it('returns VERSION_NOT_FOUND when version does not exist', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    messageVersionRepository.findById.mockResolvedValue(null);

    const sut = new FindMessageVersionByIdUseCase(messageVersionRepository);

    const result = await sut.execute({ id: 'version-1' });

    expect(result).toEqual({
      success: false,
      error: 'VERSION_NOT_FOUND',
    });
  });

  it('returns the version when it exists', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    messageVersionRepository.findById.mockResolvedValue(
      MessageVersion.reconstitute(
        'version-1',
        'message-1',
        'Texto',
        'user',
        new Date('2024-01-01T00:00:00.000Z'),
      ),
    );

    const sut = new FindMessageVersionByIdUseCase(messageVersionRepository);

    const result = await sut.execute({ id: 'version-1' });

    expect(result).toMatchObject({
      success: true,
      version: {
        id: 'version-1',
        messageId: 'message-1',
        content: 'Texto',
      },
    });
  });
});
