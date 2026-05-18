import { User } from './user.entity';
import { Role } from '../enums/role.enum';

describe('User', () => {
  it('creates a valid user and normalizes the email', () => {
    const user = User.create(
      'user-1',
      ' Maria ',
      'Maria@Example.com',
      'secret123',
      Role.PARENT,
    );

    expect(user).not.toBeNull();
    expect(user?.name).toBe('Maria');
    expect(user?.email.value).toBe('maria@example.com');
    expect(user?.role).toBe(Role.PARENT);
  });

  it('returns null when creation invariants fail', () => {
    expect(User.create('', 'Maria', 'maria@example.com', 'secret123', Role.PARENT)).toBeNull();
    expect(User.create('user-1', '', 'maria@example.com', 'secret123', Role.PARENT)).toBeNull();
    expect(User.create('user-1', 'Maria', 'maria@example.com', '123', Role.PARENT)).toBeNull();
    expect(User.create('user-1', 'Maria', 'invalid', 'secret123', Role.PARENT)).toBeNull();
  });

  it('updates name, email and password when valid', () => {
    const user = User.create(
      'user-1',
      'Maria',
      'maria@example.com',
      'secret123',
      Role.PARENT,
    ) as User;

    expect(user.updateName(' Maria Silva ')).toBe(true);
    expect(user.updateEmail('Maria.Silva@Example.com')).toBe(true);
    expect(user.updatePassword('newsecret123')).toBe(true);
    expect(user.name).toBe('Maria Silva');
    expect(user.email.value).toBe('maria.silva@example.com');
  });

  it('rejects invalid updates', () => {
    const user = User.create(
      'user-1',
      'Maria',
      'maria@example.com',
      'secret123',
      Role.PARENT,
    ) as User;

    expect(user.updateName('   ')).toBe(false);
    expect(user.updateEmail('invalid')).toBe(false);
    expect(user.updatePassword('123')).toBe(false);
  });

  it('evaluates role capabilities correctly', () => {
    const parent = User.create('user-1', 'Parent', 'p@example.com', 'secret123', Role.PARENT) as User;
    const specialist = User.create('user-2', 'Specialist', 's@example.com', 'secret123', Role.SPECIALIST) as User;
    const admin = User.create('user-3', 'Admin', 'a@example.com', 'secret123', Role.ADMIN) as User;

    expect(parent.canPublishArticles()).toBe(false);
    expect(specialist.canPublishArticles()).toBe(true);
    expect(admin.canPublishArticles()).toBe(true);
    expect(admin.canModerateContent()).toBe(true);
    expect(parent.isParent()).toBe(true);
    expect(specialist.isSpecialist()).toBe(true);
    expect(admin.isAdmin()).toBe(true);
  });
});
