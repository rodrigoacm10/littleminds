import { FindAllUsersUseCase } from './find-all-users.use-case';
import { Role, User, type UserRepository } from '../../../domain';

describe('FindAllUsersUseCase', () => {
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

  const makeUser = (id: string, role: Role) =>
    User.reconstitute(
      id,
      `User ${id}`,
      `${id}@example.com`,
      'hashed-password',
      role,
      new Date('2024-01-01T00:00:00.000Z'),
      new Date('2024-01-01T00:00:00.000Z'),
    );

  it('lists all users when no role filter is provided', async () => {
    const userRepository = makeUserRepository();
    userRepository.findAll.mockResolvedValue([
      makeUser('user-1', Role.PARENT),
      makeUser('user-2', Role.ADMIN),
    ]);

    const sut = new FindAllUsersUseCase(userRepository);

    const result = await sut.execute();

    expect(result).toMatchObject({
      success: true,
      users: [
        { id: 'user-1', role: Role.PARENT },
        { id: 'user-2', role: Role.ADMIN },
      ],
    });
  });

  it('filters users by role when provided', async () => {
    const userRepository = makeUserRepository();
    userRepository.findByRole.mockResolvedValue([
      makeUser('user-2', Role.ADMIN),
    ]);

    const sut = new FindAllUsersUseCase(userRepository);

    const result = await sut.execute({ role: Role.ADMIN });

    expect(result).toMatchObject({
      success: true,
      users: [{ id: 'user-2', role: Role.ADMIN }],
    });
    expect(userRepository.findByRole).toHaveBeenCalledWith(Role.ADMIN);
  });
});
