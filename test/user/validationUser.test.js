import { describe, it, expect } from 'vitest'
import { validateUser } from '../../users/userSchema';

describe('validateUser', () => {
  it('should return false if no arguments are provided', () => {
    const result = validateUser();
    expect(result.success).toBe(false); // Adjusted to check result.success
    expect(result.data).toBeUndefined()
  });

  it('should return false if userName or password is not provided', () => {
    const result = validateUser(undefined, 'password');
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    const result2 = validateUser(undefined, 'password')
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password are not strings', () => {
    const result = validateUser(123, 'password');
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    const result2 = validateUser('userName', 123);
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password are empty', () => {
    const result = validateUser('', 'password');
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    const result2 = validateUser('userName', '');
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password contain spaces', () => {
    const result = validateUser('user name', 'password');
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    const result2 = validateUser('userName', 'pass word');
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return an object with success set to true and data as an object if userName and password are valid', () => {
    const result = validateUser('username', 'password');
    expect(result.success).toBe(true);
    expect(result.data).toBeInstanceOf(Object);
  });

});
