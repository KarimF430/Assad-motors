# Testing Guide for Project Killer Whale

This guide explains how to run and write tests for the Project Killer Whale application, covering both frontend (Next.js/React) and backend (Express/MongoDB) testing.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Best Practices](#testing-best-practices)
- [Mocking Strategies](#mocking-strategies)
- [CI/CD Integration](#cicd-integration)

## Overview

### Tech Stack

**Frontend Testing:**
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@testing-library/user-event**: User interaction simulation

**Backend Testing:**
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertions for API testing
- **mongodb-memory-server**: In-memory MongoDB for isolated testing

### Test Structure

```
/Applications/WEBSITE-23092025-101/
├── __tests__/                    # Frontend tests
│   ├── utils/                    # Utility function tests
│   ├── lib/                      # Library function tests
│   └── components/               # React component tests
├── jest.config.js                # Frontend Jest configuration
├── jest.setup.js                 # Frontend test setup
│
└── backend/
    ├── __tests__/                # Backend tests
    │   ├── unit/                 # Unit tests
    │   ├── integration/          # Integration tests
    │   ├── helpers/              # Test utilities
    │   └── setup.ts              # Backend test setup
    └── jest.config.ts            # Backend Jest configuration
```

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
cd /Applications/WEBSITE-23092025-101
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Backend Tests

```bash
# Run all backend tests
cd /Applications/WEBSITE-23092025-101/backend
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Coverage Reports

After running `test:coverage`, you'll find HTML coverage reports in:
- Frontend: `/Applications/WEBSITE-23092025-101/coverage/`
- Backend: `/Applications/WEBSITE-23092025-101/backend/coverage/`

Open `coverage/lcov-report/index.html` in a browser to view detailed coverage.

## Writing Tests

### Frontend Unit Tests (Utilities)

**Example: Testing a utility function**

```typescript
// __tests__/lib/my-util.test.ts
import { myFunction } from '@/lib/my-util'

describe('myFunction', () => {
  it('should return expected result for valid input', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('')
    expect(myFunction(null)).toBeNull()
  })
})
```

### Frontend Component Tests

**Example: Testing a React component**

```typescript
// __tests__/components/MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()
    
    render(<MyComponent onClick={handleClick} />)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Backend Unit Tests

**Example: Testing utility functions**

```typescript
// backend/__tests__/unit/my-service.test.ts
import { myServiceFunction } from '../../server/services/my-service'

describe('MyService', () => {
  it('should process data correctly', () => {
    const result = myServiceFunction({ input: 'data' })
    expect(result).toEqual({ output: 'processed data' })
  })

  it('should throw error for invalid input', () => {
    expect(() => myServiceFunction(null)).toThrow('Invalid input')
  })
})
```

### Backend Integration Tests (API Endpoints)

**Example: Testing API endpoints with Supertest**

```typescript
// backend/__tests__/integration/api-brands.test.ts
import request from 'supertest'
import express from 'express'
import { registerRoutes } from '../../server/routes'
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/test-db'

describe('Brands API', () => {
  let app: express.Express
  let authToken: string

  beforeAll(async () => {
    await connectTestDB()
    app = express()
    app.use(express.json())
    registerRoutes(app, storage)
  })

  afterAll(async () => {
    await disconnectTestDB()
  })

  afterEach(async () => {
    await clearTestDB()
  })

  describe('GET /api/brands', () => {
    it('should return list of brands', async () => {
      const response = await request(app)
        .get('/api/brands')
        .expect(200)

      expect(response.body).toBeInstanceOf(Array)
    })
  })

  describe('POST /api/brands', () => {
    it('should create a new brand with authentication', async () => {
      const response = await request(app)
        .post('/api/brands')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Brand',
          slug: 'test-brand',
        })
        .expect(201)

      expect(response.body.name).toBe('Test Brand')
      expect(response.body.id).toBeDefined()
    })

    it('should reject unauthenticated requests', async () => {
      await request(app)
        .post('/api/brands')
        .send({ name: 'Test Brand' })
        .expect(401)
    })
  })
})
```

## Testing Best Practices

### General Principles

1. **Write descriptive test names**: Use `it('should ...')` format
2. **Follow AAA pattern**: Arrange, Act, Assert
3. **Test one thing at a time**: Each test should verify a single behavior
4. **Keep tests independent**: Tests should not depend on each other
5. **Use meaningful assertions**: Clear expectations that document behavior

### Frontend Best Practices

1. **Test user interactions, not implementation**:
   ```typescript
   // ✅ Good: Test what users see/do
   expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
   
   // ❌ Bad: Test implementation details
   expect(component.state.value).toBe('something')
   ```

2. **Use accessible queries** (in order of preference):
   - `getByRole` 
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`
   - `getByTestId` (last resort)

3. **Clean up after tests**:
   ```typescript
   afterEach(() => {
     cleanup() // Automatically done by React Testing Library
   })
   ```

### Backend Best Practices

1. **Isolate tests with in-memory database**:
   - Use `mongodb-memory-server` for fast, isolated tests
   - Clear database between tests

2. **Mock external dependencies**:
   ```typescript
   jest.mock('../../server/services/external-api', () => ({
     fetchData: jest.fn().mockResolvedValue({ data: 'mocked' })
   }))
   ```

3. **Test error cases**:
   ```typescript
   it('should handle database errors gracefully', async () => {
     mockStorage.getBrands.mockRejectedValue(new Error('DB Error'))
     
     const response = await request(app).get('/api/brands')
     expect(response.status).toBe(500)
   })
   ```

## Mocking Strategies

### Mocking Modules

```typescript
// Mock an entire module
jest.mock('@/lib/api', () => ({
  fetchData: jest.fn(),
}))

// Use the mock in tests
import { fetchData } from '@/lib/api'
const mockFetchData = fetchData as jest.MockedFunction<typeof fetchData>

it('should call API', async () => {
  mockFetchData.mockResolvedValue({ data: 'test' })
  // ... test code
  expect(mockFetchData).toHaveBeenCalledWith('param')
})
```

### Mocking Environment Variables

```typescript
// In test file
const originalEnv = process.env

beforeEach(() => {
  process.env = { ...originalEnv, NODE_ENV: 'test' }
})

afterEach(() => {
  process.env = originalEnv
})
```

### Mocking Timers

```typescript
beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

it('should trigger after timeout', () => {
  const callback = jest.fn()
  setTimeout(callback, 1000)
  
  jest.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalled()
})
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test -- --coverage
      - uses: codecov/codecov-action@v3
```

## Troubleshooting

### Common Issues

1. **Tests timeout**: Increase timeout in jest.config
2. **Module resolution errors**: Check `moduleNameMapper` in jest.config
3. **MongoDB memory server fails**: Ensure sufficient memory/disk space

### Debug Tips

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- path/to/test.test.ts

# Debug in VS Code - Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## Next Steps

1. Extend test coverage to critical business logic
2. Add E2E tests for complete user flows
3. Integrate with CI/CD pipeline
4. Set up code coverage reporting
5. Add visual regression testing for UI components
