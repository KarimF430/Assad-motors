# Testing Best Practices Guide

## Table of Contents
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Mocking Strategies](#mocking-strategies)
- [CI/CD Workflow](#cicd-workflow)
- [Coverage Requirements](#coverage-requirements)
- [Troubleshooting](#troubleshooting)

---

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (during development)
npm run test:watch

# Run specific test file
npm test redis-cache

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### Frontend Tests

```bash
# Run all frontend tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- api.test
```

### Run All Tests (Root)

```bash
# From project root
npm test
```

---

## Writing Tests

### Test Structure (AAA Pattern)

Follow the **Arrange-Act-Assert** pattern:

```typescript
describe('User Registration', () => {
  it('should create a new user with valid data', async () => {
    // Arrange: Setup test data and mocks
    const userData = {
      email: 'test@example.com',
      password: 'securePassword123',
    };
    
    // Act: Execute the function being tested
    const result = await registerUser(userData);
    
    // Assert: Verify the results
    expect(result.success).toBe(true);
    expect(result.user.email).toBe(userData.email);
  });
});
```

### Test Naming Conventions

- Use descriptive test names that explain the scenario
- Format: `should [expected behavior] when [condition]`

**Good:**
```typescript
it('should return 404 when brand is not found', () => {});
it('should cache data after successful API call', () => {});
it('should retry request on network failure', () => {});
```

**Bad:**
```typescript
it('test 1', () => {});
it('works', () => {});
it('error case', () => {});
```

### Testing Async Code

Always use `async/await` for testing asynchronous operations:

```typescript
it('should fetch user data from API', async () => {
  const user = await api.getUser('123');
  expect(user).toBeDefined();
});

// For promises that should reject
it('should throw error for invalid ID', async () => {
  await expect(api.getUser('invalid')).rejects.toThrow('Invalid ID');
});
```

---

## Mocking Strategies

### Mocking Redis

```typescript
jest.mock('ioredis', () => {
  return jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  }));
});
```

### Mocking MongoDB

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

### Mocking External APIs (Fetch)

```typescript
global.fetch = jest.fn();

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
});

it('should handle API response', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' }),
  });
  
  const result = await fetchData();
  expect(result).toBeDefined();
});
```

### Mocking S3 / AWS Services

```typescript
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn(() => ({
    send: jest.fn(),
  })),
  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));
```

### Mocking Environment Variables

```typescript
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    API_KEY: 'test-key',
  };
});

afterEach(() => {
  process.env = originalEnv;
});
```

---

## CI/CD Workflow

### GitHub Actions Pipeline

Our CI/CD pipeline automatically runs on:
- **Every push** to any branch
- **Every pull request**
- **Manual trigger** via workflow_dispatch

### Pipeline Jobs

1. **Backend Tests** (10 min timeout)
   - Install dependencies
   - Run all backend tests
   - Generate coverage reports
   - Upload artifacts

2. **Frontend Tests** (10 min timeout)
   - Install dependencies
   - Run all frontend tests
   - Generate coverage reports
   - Upload artifacts

3. **Lint & Type Check** (5 min timeout)
   - TypeScript type checking
   - ESLint validation (if configured)
   - Code formatting checks

4. **Test Results Summary**
   - Aggregate results from all jobs
   - Post summary to PR
   - Fail if any test job failed

### Viewing Test Results

1. Go to the **Actions** tab in GitHub
2. Click on the workflow run
3. View individual job logs
4. Download coverage reports from artifacts

### Branch Protection Rules

Recommended settings:
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Required checks:
  - Backend Tests
  - Frontend Tests
  - Lint & Type Check

---

## Coverage Requirements

### Current Thresholds

- **Backend**: 70% coverage (branches, functions, lines, statements)
- **Frontend**: 70% coverage (branches, functions, lines, statements)

### Viewing Coverage

```bash
# Backend
cd backend && npm run test:coverage
# Opens coverage/lcov-report/index.html

# Frontend
npm run test:coverage
# Opens coverage/lcov-report/index.html
```

### Improving Coverage

1. **Identify uncovered code:**
   ```bash
   npm run test:coverage
   # Check the HTML report for red/yellow highlighted code
   ```

2. **Write tests for critical paths:**
   - Error handling
   - Edge cases
   - Happy path scenarios

3. **Focus on:**
   - Pure functions (easiest to test)
   - Business logic
   - Data transformations
   - API endpoints

4. **Don't obsess over 100%:**
   - Some code is hard to test (UI, third-party integrations)
   - Focus on critical business logic
   - Aim for meaningful tests, not just coverage numbers

---

## Troubleshooting

### Common Issues

#### 1. Tests timing out

**Problem:** Tests hang or exceed timeout

**Solution:**
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // ...
}, 15000); // 15 second timeout

// Or in beforeAll
beforeAll(() => {
  jest.setTimeout(15000);
});
```

#### 2. Mock not working

**Problem:** Mock doesn't override real implementation

**Solution:**
```typescript
// Mock BEFORE importing the module that uses it
jest.mock('ioredis');
import { redis } from './redis-cache';  // Now uses mock

// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### 3. Async test failures

**Problem:** Test passes but has unhandled promise rejection

**Solution:**
```typescript
// Always await async operations
it('test', async () => {
  await asyncFunction();  // Don't forget await!
});

// Or return the promise
it('test', () => {
  return asyncFunction().then(result => {
    expect(result).toBeDefined();
  });
});
```

#### 4. Environment variable not found

**Problem:** `process.env.VARIABLE` is undefined in tests

**Solution:**
```typescript
// Set in setup file (backend/__tests__/setup.ts)
process.env.VARIABLE = 'test-value';

// Or in individual test
beforeAll(() => {
  process.env.VARIABLE = 'test-value';
});
```

#### 5. MongoDB connection issues

**Problem:** Tests fail with MongoDB connection errors

**Solution:**
```typescript
// Use mongodb-memory-server for tests
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // Connect to in-memory database
});

afterAll(async () => {
  await mongoServer.stop();
});
```

#### 6. Redis connection errors

**Problem:** Redis connection refused in tests

**Solution:**
```typescript
// Mock Redis entirely instead of using real connection
jest.mock('ioredis', () => {
  return jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    // ... other methods
  }));
});
```

### Running Tests Locally vs CI

**Local:**
- May have access to actual databases
- Can use environmental variables from `.env`
- May have different OS (macOS, Windows, Linux)

**CI (GitHub Actions):**
- Clean environment every run
- No access to `.env` files (use secrets/environment variables)
- Always runs on Linux (ubuntu-latest)
- Time limits enforced

**Best Practice:** Write tests that work in both environments by:
- Using mocks for external services
- Not relying on specific OS features
- Setting required env vars in code/setup files

---

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Test-Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)

---

## Quick Reference

### Useful Jest Matchers

```typescript
expect(value).toBe(expected);              // Strict equality (===)
expect(value).toEqual(expected);           // Deep equality
expect(value).toBeDefined();               // Not undefined
expect(value).toBeNull();                  // Null
expect(value).toBeTruthy();                // Truthy value
expect(value).toBeFalsy();                 // Falsy value
expect(array).toContain(item);             // Array contains item
expect(string).toMatch(/pattern/);         // Regex match
expect(fn).toThrow(error);                 // Function throws
expect(fn).toHaveBeenCalled();             // Mock was called
expect(fn).toHaveBeenCalledWith(args);     // Mock called with args
```

### Test Lifecycle Hooks

```typescript
beforeAll(() => {})     // Runs once before all tests
afterAll(() => {})      // Runs once after all tests
beforeEach(() => {})    // Runs before each test
afterEach(() => {})     // Runs after each test
```

---

**Last Updated:** December 2, 2025  
**Maintained By:** Development Team
