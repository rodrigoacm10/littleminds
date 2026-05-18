import { DeleteUserUseCase } from './delete-user.use-case';
import { type UserRepository } from '../../../domain';

describe('DeleteUserUseCase', () => {
  const makeUserRepository = (): jest.Mocked<UserRepository> => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    existsByEmail: jest.fn(),
    findAll: jest.fn(),
    findByRole: jest.fn(),
    delete: jest.fn(),
    existsById: jest.fn(),
  });

  it('returns USER_NOT_FOUND when user does not exist', async () => {
    const userRepository = makeUserRepository();
    userRepository.existsById.mockResolvedValue(false);

    const sut = new DeleteUserUseCase(userRepository);

    const result = await sut.execute({ id: 'user-1' });

    expect(result).toEqual({
      success: false,
      error: 'USER_NOT_FOUND',
    });
  });

  it('deletes the user when it exists', async () => {
    const userRepository = makeUserRepository();
    userRepository.existsById.mockResolvedValue(true);

    const sut = new DeleteUserUseCase(userRepository);

    const result = await sut.execute({ id: 'user-1' });

    expect(result).toEqual({ success: true });
    expect(userRepository.delete).toHaveBeenCalledWith('user-1');
  });
});
