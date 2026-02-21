import {
    hashPassword,
    comparePassword,
    generateAccessToken,
    generateRefreshToken,
    isValidEmail,
    isStrongPassword,
    sanitizeUser,
} from '../../server/auth'

describe('Auth Utilities', () => {
    describe('hashPassword', () => {
        it('should hash a password', async () => {
            const password = 'TestPassword123!'
            const hash = await hashPassword(password)

            expect(hash).toBeDefined()
            expect(hash).not.toBe(password)
            expect(hash.length).toBeGreaterThan(0)
        })

        it('should generate different hashes for same password', async () => {
            const password = 'TestPassword123!'
            const hash1 = await hashPassword(password)
            const hash2 = await hashPassword(password)

            expect(hash1).not.toBe(hash2)
        })
    })

    describe('comparePassword', () => {
        it('should return true for correct password', async () => {
            const password = 'TestPassword123!'
            const hash = await hashPassword(password)
            const isMatch = await comparePassword(password, hash)

            expect(isMatch).toBe(true)
        })

        it('should return false for incorrect password', async () => {
            const password = 'TestPassword123!'
            const wrongPassword = 'WrongPassword456!'
            const hash = await hashPassword(password)
            const isMatch = await comparePassword(wrongPassword, hash)

            expect(isMatch).toBe(false)
        })
    })

    describe('generateAccessToken', () => {
        it('should generate a valid JWT token', () => {
            const user = {
                id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'admin',
            }

            const token = generateAccessToken(user)

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)
            expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
        })
    })

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const userId = 'user123'
            const token = generateRefreshToken(userId)

            expect(token).toBeDefined()
            expect(typeof token).toBe('string')
            expect(token.length).toBeGreaterThan(0)
            expect(token.split('.')).toHaveLength(3)
        })
    })

    describe('isValidEmail', () => {
        it('should return true for valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.in',
                'admin+test@company.com',
                'user123@test-domain.org',
            ]

            validEmails.forEach((email) => {
                expect(isValidEmail(email)).toBe(true)
            })
        })

        it('should return false for invalid email addresses', () => {
            const invalidEmails = [
                'notanemail',
                '@example.com',
                'user@',
                'user @example.com',
                'user@domain',
                '',
            ]

            invalidEmails.forEach((email) => {
                expect(isValidEmail(email)).toBe(false)
            })
        })
    })

    describe('isStrongPassword', () => {
        it('should accept strong passwords', () => {
            const strongPasswords = [
                'Test123!@#',
                'MyP@ssw0rd',
                'Secure#Pass1',
                'Str0ng!Passw0rd',
            ]

            strongPasswords.forEach((password) => {
                const result = isStrongPassword(password)
                expect(result.isValid).toBe(true)
                expect(result.errors).toHaveLength(0)
            })
        })

        it('should reject passwords that are too short', () => {
            const result = isStrongPassword('Test1!')

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Password must be at least 8 characters long')
        })

        it('should reject passwords without lowercase letters', () => {
            const result = isStrongPassword('TEST123!@#')

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Password must contain lowercase letters')
        })

        it('should reject passwords without uppercase letters', () => {
            const result = isStrongPassword('test123!@#')

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Password must contain uppercase letters')
        })

        it('should reject passwords without numbers', () => {
            const result = isStrongPassword('TestPassword!')

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Password must contain numbers')
        })

        it('should reject passwords without special characters', () => {
            const result = isStrongPassword('TestPassword123')

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Password must contain special characters')
        })

        it('should return all errors for weak password', () => {
            const result = isStrongPassword('weak')

            expect(result.isValid).toBe(false)
            expect(result.errors.length).toBeGreaterThan(1)
        })
    })

    describe('sanitizeUser', () => {
        it('should remove password from user object', () => {
            const user = {
                id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'admin',
                password: 'hashedpassword123',
                createdAt: new Date(),
                lastLogin: new Date(),
            }

            const sanitized = sanitizeUser(user as any)

            expect(sanitized).not.toHaveProperty('password')
            expect(sanitized).toHaveProperty('id')
            expect(sanitized).toHaveProperty('email')
            expect(sanitized).toHaveProperty('name')
            expect(sanitized).toHaveProperty('role')
        })
    })
})
