/// <reference types="jest" />

import request from 'supertest'
import express, { Express } from 'express'
import cookieParser from 'cookie-parser'
import { registerRoutes } from '../../server/routes'
import { hashPassword } from '../../server/auth'
import { connectTestDB, disconnectTestDB, clearTestDB } from '../helpers/test-db'

// Mock storage interface for testing
jest.mock('../../server/routes/admin-media', () => {
    const express = require('express')
    return {
        __esModule: true,
        default: express.Router()
    }
})

const mockStorage = {
    async getAdminUser(email: string) {
        if (email === 'test@example.com') {
            return {
                id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'admin',
                password: await hashPassword('TestPassword123!'),
                createdAt: new Date(),
                lastLogin: new Date(),
            }
        }
        return null
    },

    async getAdminUserById(id: string) {
        if (id === 'user123') {
            return {
                id: 'user123',
                email: 'test@example.com',
                name: 'Test User',
                role: 'admin',
                password: await hashPassword('TestPassword123!'),
                createdAt: new Date(),
                lastLogin: new Date(),
            }
        }
        return null
    },

    async getActiveSession(userId: string) {
        return null
    },

    async createSession(userId: string, token: string) {
        return true
    },

    async invalidateSession(userId: string) {
        return true
    },

    async updateAdminUserLogin(userId: string) {
        return true
    },
}

describe('Auth API Integration Tests', () => {
    let app: Express

    beforeAll(async () => {
        await connectTestDB()

        // Create Express app with routes
        app = express()
        app.use(express.json())
        app.use(cookieParser())

        // Register routes with mock storage
        registerRoutes(app, mockStorage as any)
    })

    afterAll(async () => {
        await disconnectTestDB()
    })

    afterEach(async () => {
        await clearTestDB()
    })

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                })
                .expect(200)

            expect(response.body.success).toBe(true)
            expect(response.body.user).toBeDefined()
            expect(response.body.user.email).toBe('test@example.com')
            expect(response.body.user).not.toHaveProperty('password')
            expect(response.body.token).toBeDefined()
            expect(response.body.refreshToken).toBeDefined()
        })

        it('should reject login with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'TestPassword123!',
                })
                .expect(401)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('INVALID_CREDENTIALS')
        })

        it('should reject login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'WrongPassword123!',
                })
                .expect(401)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('INVALID_CREDENTIALS')
        })

        it('should reject login with missing credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                })
                .expect(400)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('MISSING_CREDENTIALS')
        })

        it('should reject login with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'notanemail',
                    password: 'TestPassword123!',
                })
                .expect(400)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('INVALID_EMAIL')
        })

        it('should set cookies on successful login', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                })
                .expect(200)

            const cookies = response.headers['set-cookie']
            expect(cookies).toBeDefined()

            if (Array.isArray(cookies)) {
                const tokenCookie = cookies.find((c: string) => c.startsWith('token='))
                const refreshTokenCookie = cookies.find((c: string) => c.startsWith('refreshToken='))

                expect(tokenCookie).toBeDefined()
                expect(refreshTokenCookie).toBeDefined()
            }
        })
    })

    describe('GET /api/auth/me', () => {
        it('should return user info with valid token', async () => {
            // First login to get token
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                })

            const token = loginResponse.body.token

            // Then get user info
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body.success).toBe(true)
            expect(response.body.user).toBeDefined()
            expect(response.body.user.email).toBe('test@example.com')
            expect(response.body.user).not.toHaveProperty('password')
        })

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .expect(401)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('NO_TOKEN')
        })

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(403)

            expect(response.body.error).toBeDefined()
            expect(response.body.code).toBe('INVALID_TOKEN')
        })
    })

    describe('POST /api/auth/logout', () => {
        it('should logout successfully with valid token', async () => {
            // First login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                })

            const token = loginResponse.body.token

            // Then logout
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            expect(response.body.success).toBe(true)
            expect(response.body.message).toBeDefined()
        })

        it('should clear cookies on logout', async () => {
            // First login
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                })

            const token = loginResponse.body.token

            // Then logout
            const response = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)

            const cookies = response.headers['set-cookie']
            expect(cookies).toBeDefined()
        })
    })
})
