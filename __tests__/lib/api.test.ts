import { api, formatPrice, formatMileage, getImageUrl, handleApiError } from '../../lib/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Client', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    describe('getBrands', () => {
        it('should fetch all brands successfully', async () => {
            const mockResponse = {
                success: true,
                data: {
                    brands: [
                        { id: '1', name: 'Test Brand', slug: 'test-brand' },
                    ],
                    pagination: { total: 1, limit: 10, offset: 0, pages: 1 },
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
                status: 200,
                statusText: 'OK',
            });

            const result = await api.getBrands();

            expect(result.success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/brands'),
                expect.any(Object)
            );
        });

        it('should handle featured brands filter', async () => {
            const mockResponse = {
                success: true,
                data: {
                    brands: [],
                    pagination: { total: 0, limit: 10, offset: 0, pages: 0 },
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            await api.getBrands({ featured: true });

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('featured=true'),
                expect.any(Object)
            );
        });

        it('should handle pagination params', async () => {
            const mockResponse = {
                success: true,
                data: {
                    brands: [],
                    pagination: { total: 0, limit: 5, offset: 10, pages: 0 },
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            await api.getBrands({ limit: 5, offset: 10 });

            const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
            expect(callUrl).toContain('limit=5');
            expect(callUrl).toContain('offset=10');
        });
    });

    describe('getModels', () => {
        it('should fetch models with filters', async () => {
            const mockResponse = {
                success: true,
                data: {
                    models: [],
                    pagination: { total: 0, limit: 10, offset: 0, pages: 0 },
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            await api.getModels({ brand_id: 'test-brand-id', body_type: 'SUV' });

            const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
            expect(callUrl).toContain('brand_id=test-brand-id');
            expect(callUrl).toContain('body_type=SUV');
        });

        it('should fetch model by slug', async () => {
            const mockResponse = {
                success: true,
                data: {
                    model: { id: '1', name: 'Test Model', slug: 'test-model' },
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await api.getModelBySlug('test-model');

            expect(result.success).toBe(true);
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/models/test-model'),
                expect.any(Object)
            );
        });
    });

    describe('Error Handling', () => {
        it('should handle network errors gracefully', async () => {
            // Mock all retry attempts to fail with network error
            (global.fetch as jest.Mock)
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'))
                .mockRejectedValueOnce(new Error('Network error'));

            const result = await api.getBrands();

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        }, 15000);

        it('should handle HTTP errors', async () => {
            // Mock all retry attempts to return 404
            const errorResponse = {
                ok: false,
                status: 404,
                statusText: 'Not Found',
                text: async () => 'Resource not found',
            };
            (global.fetch as jest.Mock)
                .mockResolvedValueOnce(errorResponse)
                .mockResolvedValueOnce(errorResponse)
                .mockResolvedValueOnce(errorResponse);

            const result = await api.getBrandBySlug('non-existent');

            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
        }, 15000);

        it('should retry on failure', async () => {
            // First call fails, second succeeds
            (global.fetch as jest.Mock)
                .mockRejectedValueOnce(new Error('Temporary error'))
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true, data: { brands: [], pagination: {} } }),
                });

            const result = await api.getBrands();

            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(result.success).toBe(true);
        }, 15000); // Longer timeout for retry test
    });

    describe('Search', () => {
        it('should search across all entities', async () => {
            const mockResponse = {
                success: true,
                data: {
                    query: 'test',
                    results: {
                        brands: [],
                        models: [],
                        variants: [],
                    },
                    total: 0,
                },
            };

            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await api.search('test', 10);

            expect(result.success).toBe(true);
            const callUrl = (global.fetch as jest.Mock).mock.calls[0][0];
            expect(callUrl).toContain('q=test');
            expect(callUrl).toContain('limit=10');
        });
    });
});

describe('Utility Functions', () => {
    describe('formatPrice', () => {
        it('should format prices in crores', () => {
            expect(formatPrice(15000000)).toBe('₹1.5 Cr');
            expect(formatPrice(10000000)).toBe('₹1.0 Cr');
        });

        it('should format prices in lakhs', () => {
            expect(formatPrice(1500000)).toBe('₹15.0 L');
            expect(formatPrice(100000)).toBe('₹1.0 L');
        });

        it('should format small prices with locale', () => {
            expect(formatPrice(50000)).toBe('₹50,000');
            expect(formatPrice(1000)).toBe('₹1,000');
        });

        it('should handle zero price', () => {
            expect(formatPrice(0)).toBe('₹0');
        });
    });

    describe('formatMileage', () => {
        it('should format mileage with unit', () => {
            expect(formatMileage(18.5)).toBe('18.5 kmpl');
            expect(formatMileage(25)).toBe('25 kmpl');
        });

        it('should return N/A for undefined mileage', () => {
            expect(formatMileage(undefined)).toBe('N/A');
            expect(formatMileage(0)).toBe('N/A');
        });
    });

    describe('getImageUrl', () => {
        it('should return placeholder for undefined/empty image', () => {
            expect(getImageUrl(undefined)).toBe('/api/placeholder/400/300');
            expect(getImageUrl('')).toBe('/api/placeholder/400/300');
        });

        it('should return full URL for HTTP images', () => {
            const httpUrl = 'https://example.com/image.jpg';
            expect(getImageUrl(httpUrl)).toBe(httpUrl);
        });

        it('should prepend base URL for relative paths', () => {
            const result = getImageUrl('/uploads/car.jpg');
            expect(result).toContain('/uploads/car.jpg');
        });
    });

    describe('handleApiError', () => {
        it('should extract message from response', () => {
            const error = {
                response: {
                    data: {
                        message: 'Custom error message',
                    },
                },
            };
            expect(handleApiError(error)).toBe('Custom error message');
        });

        it('should use error message property', () => {
            const error = new Error('Direct error message');
            expect(handleApiError(error)).toBe('Direct error message');
        });

        it('should return default message for unknown errors', () => {
            expect(handleApiError({})).toBe('An unexpected error occurred');
            expect(handleApiError(null)).toBe('An unexpected error occurred');
        });
    });
});
