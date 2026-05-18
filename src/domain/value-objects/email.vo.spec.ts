import { Email } from './email.vo';

describe('Email', () => {
  it('creates a normalized email when input is valid', () => {
    const email = Email.create('  Maria.Silva@Example.com  ');

    expect(email?.value).toBe('maria.silva@example.com');
    expect(email?.domain).toBe('example.com');
    expect(email?.localPart).toBe('maria.silva');
  });

  it('returns null for invalid email formats', () => {
    expect(Email.create('')).toBeNull();
    expect(Email.create('invalid-email')).toBeNull();
    expect(Email.create('name@domain')).toBeNull();
  });

  it('compares emails by normalized value', () => {
    const first = Email.create('TEST@EXAMPLE.COM');
    const second = Email.create('test@example.com');

    expect(first?.equals(second as Email)).toBe(true);
    expect(first?.toString()).toBe('test@example.com');
    expect(first?.toJSON()).toBe('test@example.com');
  });
});
