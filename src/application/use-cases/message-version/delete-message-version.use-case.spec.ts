import { DeleteMessageVersionUseCase } from './delete-message-version.use-case';
import { MessageVersion, type MessageVersionRepository } from '../../../domain';

describe('DeleteMessageVersionUseCase', () => {
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

    const sut = new DeleteMessageVersionUseCase(messageVersionRepository);

    const result = await sut.execute({ id: 'version-1' });

    expect(result).toEqual({
      success: false,
      error: 'VERSION_NOT_FOUND',
    });
  });

  it('returns CANNOT_DELETE_ONLY_VERSION when message has a single version', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    const version = MessageVersion.reconstitute(
      'version-1',
      'message-1',
      'Texto único',
      'user',
      new Date('2024-01-01T00:00:00.000Z'),
    );
    messageVersionRepository.findById.mockResolvedValue(version);
    messageVersionRepository.findByMessageId.mockResolvedValue([version]);

    const sut = new DeleteMessageVersionUseCase(messageVersionRepository);

    const result = await sut.execute({ id: 'version-1' });

    expect(result).toEqual({
      success: false,
      error: 'CANNOT_DELETE_ONLY_VERSION',
    });
  });

  it('deletes the version when there are multiple versions', async () => {
    const messageVersionRepository = makeMessageVersionRepository();
    const version1 = MessageVersion.reconstitute(
      'version-1',
      'message-1',
      'Texto 1',
      'user',
      new Date('2024-01-01T00:00:00.000Z'),
    );
    const version2 = MessageVersion.reconstitute(
      'version-2',
      'message-1',
      'Texto 2',
      'system',
      new Date('2024-01-01T00:01:00.000Z'),
    );
    messageVersionRepository.findById.mockResolvedValue(version1);
    messageVersionRepository.findByMessageId.mockResolvedValue([version1, version2]);

    const sut = new DeleteMessageVersionUseCase(messageVersionRepository);

    const result = await sut.execute({ id: 'version-1' });

    expect(result).toEqual({ success: true });
    expect(messageVersionRepository.delete).toHaveBeenCalledWith('version-1');
  });
});
