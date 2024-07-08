import { describe, it, expect } from 'vitest';
import { userValidate } from '../../users/userValidator.js';
import { TEST_PASSWORD, TEST_PASSWORD_WITH_SPACE, TEST_USERNAME, TEST_USERNAME_WITH_SPACE } from '../../utils/textConstants';

describe('userValidate', () => {
  it('should return false if no arguments are provided', () => {
    // Act
    const result = userValidate();
    // Assert
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
  });

  it('should return false if userName or password is not provided', () => {
    // Act
    const result = userValidate(undefined, TEST_PASSWORD);
    const result2 = userValidate(TEST_USERNAME, undefined);
    // Assert
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password are not strings', () => {
    // Act
    const result1 = userValidate(123, TEST_PASSWORD);
    const result2 = userValidate(TEST_USERNAME, 123);
    // Assert
    expect(result1.success).toBe(false);
    expect(result1.data).toBeUndefined();
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password are empty', () => {
    // Act
    const result = userValidate('', TEST_PASSWORD);
    const result2 = userValidate(TEST_USERNAME, '');
    // Assert
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return false if userName or password contain spaces', () => {
    // Act
    const result1 = userValidate(TEST_USERNAME_WITH_SPACE, TEST_PASSWORD);
    const result2 = userValidate(TEST_USERNAME, TEST_PASSWORD_WITH_SPACE);
    // Assert
    expect(result1.success).toBe(false);
    expect(result1.data).toBeUndefined();
    expect(result2.success).toBe(false);
    expect(result2.data).toBeUndefined();
  });

  it('should return an object with success set to true if userName and password are valid', () => {
    // Act
    const result = userValidate(TEST_USERNAME, TEST_PASSWORD);
    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
