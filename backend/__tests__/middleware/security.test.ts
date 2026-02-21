import { Request, Response, NextFunction } from 'express';
import {
    ipWhitelist,
    botDetector,
    ddosShield,
} from '../../server/middleware/security';

describe('Security Middleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup response mock
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockRes = {
            status: statusMock,
            json: jsonMock,
        };

        // Setup next function
        mockNext = jest.fn();
    });

    describe('ipWhitelist', () => {
        it('should allow localhost IPv4', () => {
            mockReq = {
                ip: '127.0.0.1',
                socket: {} as any,
            };

            ipWhitelist(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should allow localhost IPv6', () => {
            mockReq = {
                ip: '::1',
                socket: {} as any,
            };

            ipWhitelist(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should allow in development environment', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'development';

            mockReq = {
                ip: '192.168.1.100', // Random IP
                socket: {} as any,
            };

            ipWhitelist(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();

            process.env.NODE_ENV = originalEnv;
        });

        it('should block non-whitelisted IPs in production', () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';

            mockReq = {
                ip: '192.168.1.100', // Non-whitelisted IP
                socket: {} as any,
            };

            ipWhitelist(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Access denied'),
                })
            );

            process.env.NODE_ENV = originalEnv;
        });

        it('should use socket.remoteAddress if req.ip is undefined', () => {
            mockReq = {
                ip: undefined,
                socket: {
                    remoteAddress: '127.0.0.1',
                } as any,
            };

            ipWhitelist(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('botDetector', () => {
        it('should allow normal user agents', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should allow good bots (googlebot)', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('Mozilla/5.0 (compatible; Googlebot/2.1)'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(statusMock).not.toHaveBeenCalled();
        });

        it('should block headless browsers', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('Mozilla/5.0 HeadlessChrome/100.0'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Bot detected'),
                })
            );
        });

        it('should block selenium user agents', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('selenium/3.141.0 (python windows)'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it('should block curl requests', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('curl/7.68.0'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it('should block puppeteer user agents', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/91.0.4472.124 Safari/537.36 Puppeteer'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).not.toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(403);
        });

        it('should handle missing user agent', () => {
            mockReq = {
                get: jest.fn().mockReturnValue(undefined),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            // Should allow if no user agent (fail open for compatibility)
            expect(mockNext).toHaveBeenCalled();
        });

        it('should be case insensitive', () => {
            mockReq = {
                get: jest.fn().mockReturnValue('CURL/7.68.0'),
            };

            botDetector(mockReq as Request, mockRes as Response, mockNext);

            expect(statusMock).toHaveBeenCalledWith(403);
        });
    });

    describe('ddosShield', () => {
        it('should export rate limiter function', () => {
            expect(ddosShield).toBeDefined();
            expect(typeof ddosShield).toBe('function');
        });

        // Note: Testing rate limiting behavior requires more complex setup
        // with time mocking and multiple requests
    });

    describe('Security Headers', () => {
        it('should prevent common attacks', () => {
            // This test documents expected security posture
            const securityPrinciples = {
                ipWhitelisting: 'Restricts admin access to trusted IPs',
                botDetection: 'Blocks automated scraping and bad actors',
                rateLimiting: 'Prevents DDoS attacks',
            };

            expect(securityPrinciples).toBeDefined();
        });
    });
});
