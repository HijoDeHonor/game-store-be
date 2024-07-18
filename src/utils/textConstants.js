// ENTITYS:
export const INVENTORY = 'Inventory';
export const OFFERS = 'Offers';
export const USERS = 'Users';

// ERROR MESSAGES:
export const ALREADY_EXIST = 'Already exist';
export const DOES_NOT_EXIST = 'Does not exist';
export const ERROR_CREATING_USER = 'Error creating the new User';
export const FAILED_CREATE = 'Failed to create';
export const FAILED_GETTING = 'Failed getting';
export const FAILED_LOGIN_USER = 'Failed to log the User';
export const INTERNAL_SERVER_ERROR = 'Internal Server Error';
export const INVALID_DATA = 'Invalid data';
export const INVALID_LOGIN = 'UserName or Password are Incorrect';
export const PASSWORD_CONTAIN_SPACE = 'Password must not contain spaces';
export const PASSWORD_REQUIRED = 'Password is required';
export const SQLERROR = 'SQLError';
export const USERNAME_CONTAIN_SPACE = 'User Name must not contain spaces';
export const USERNAME_REQUIRED = 'User Name is required';

// ERROR TYPES:
export const ALREADY_EXIST_ERROR = 'AlreadyExistError';
export const DOES_NOT_EXIST_ERROR = 'DoesNotExistError';
export const FAILED_CREATING_ERROR = 'FailedCreatingError';
export const FAILED_GETTING_ERROR = 'FailedGettingError';
export const INVALID_DATA_ERROR = 'InvalidDataError';
export const INVALID_LOGIN_ERROR = 'InvalidLoginError';

// TEST constants
export const TEST_AUTHENTICATION_SUCCESS = 'You are authenticated';
export const TEST_DONT_EXIST_USERNAME = 'ThisUserDontExist';
export const TEST_PASSWORD = 'password';
export const TEST_PASSWORD_WITH_SPACE = 'pass word';
export const TEST_QUERY = 'this is a query test';
export const TEST_QUERY_PARAMETER = 'this is a query parameter test';
export const TEST_TOKEN = 'this is an awesome and super secure token, trust me.';
export const TEST_TOKEN_INVALID = 'invalid.token';
export const TEST_USER_ID = 'thisIsAnUserId';
export const TEST_USERNAME = 'userName';
export const TEST_USERNAME_WITH_SPACE = 'user Name';
export const TEST_WRONG_PASSWORD = 'wrongpassword';

// TEST EXPECTS
export const TEST_OFFER_CONTROLLER_FILE_NAME = 'offerController.js';
export const TEST_OFFER_REPOSITORY_METHOD_GET_ALL = 'OfferRepository.getOffers';
export const TEST_OFFER_SERVICE_METHOD_GET_ALL = 'OfferService.getOffers';
export const TEST_USER_CONTROLLER_FILE_NAME = 'userController.js';
export const TEST_USER_REPOSITORY_METHOD_CREATE = 'UserRepository.create';
export const TEST_USER_SERVICE_METHOD_CREATE = 'UserService.create';

//
export const SECRET_TOKEN_KEY = 'iam-a-super-secure-secret-word';
