import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ListToolsRequestSchema,
    ReadResourceRequestSchema,
    ListPromptsRequestSchema,
    GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import mongoose from 'mongoose';
import { createClient } from 'redis';

// Note: Environment variables are provided by Claude Desktop config
// or from system environment when running locally

// Import your existing models from schemas
import { Brand, Model, Variant, NewsArticle as News } from './db/schemas.js';
import { AdvancedMCPTools } from './mcp-advanced-tools.js';

// MCP Server Configuration
const MCP_SERVER_NAME = 'killerwhale-mcp';
const MCP_SERVER_VERSION = '1.0.0';

class KillerWhaleMCPServer {
    private server: Server;
    private redisClient: any;
    private advancedTools: AdvancedMCPTools;

    constructor() {
        this.server = new Server(
            {
                name: MCP_SERVER_NAME,
                version: MCP_SERVER_VERSION,
            },
            {
                capabilities: {
                    resources: {},
                    tools: {},
                    prompts: {},
                },
            }
        );

        this.advancedTools = new AdvancedMCPTools();
        this.setupHandlers();
    }

    async initialize() {
        // Connect to MongoDB (read-only)
        await mongoose.connect(process.env.MONGODB_URI || '', {
            readPreference: 'secondary',
            // @ts-ignore
            readConcern: { level: 'majority' },
        });

        console.error('✅ Connected to MongoDB (read-only mode)');

        // Connect to Redis
        this.redisClient = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });

        await this.redisClient.connect();
        console.error('✅ Connected to Redis');
    }

    private setupHandlers() {
        // List available resources
        this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
            return {
                resources: [
                    {
                        uri: 'killerwhale://brands',
                        name: 'All Car Brands',
                        description: 'List of all car brands in the database',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://models',
                        name: 'All Car Models',
                        description: 'List of all car models in the database',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://popular',
                        name: 'Popular Cars',
                        description: 'Most popular car models',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://electric',
                        name: 'Electric Vehicles',
                        description: 'All electric car models',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://upcoming',
                        name: 'Upcoming Launches',
                        description: 'Upcoming car launches',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://news',
                        name: 'Latest News',
                        description: 'Latest automotive news articles',
                        mimeType: 'application/json',
                    },
                    {
                        uri: 'killerwhale://stats',
                        name: 'Platform Statistics',
                        description: 'Platform usage and performance statistics',
                        mimeType: 'application/json',
                    },
                ],
            };
        });

        // Read specific resource
        this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
            const uri = request.params.uri;

            if (uri === 'killerwhale://brands') {
                const brands = await Brand.find({ status: 'active' })
                    .select('name slug logo description')
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ brands, count: brands.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://models') {
                const models = await Model.find({ status: 'active' })
                    .populate('brand', 'name slug')
                    .select('name slug brand priceRange fuelTypes seatingCapacity')
                    .limit(100)
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ models, count: models.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://popular') {
                // Get from cache or calculate
                const cacheKey = 'mcp:popular_cars';
                let popularCars = await this.redisClient.get(cacheKey);

                if (!popularCars) {
                    const models = await Model.find({ status: 'active' })
                        .populate('brand', 'name slug')
                        .select('name slug brand priceRange fuelTypes')
                        .sort({ views: -1 })
                        .limit(10)
                        .lean();

                    popularCars = JSON.stringify(models);
                    await this.redisClient.setEx(cacheKey, 3600, popularCars); // 1 hour cache
                }

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: popularCars,
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://electric') {
                const evModels = await Model.find({
                    status: 'active',
                    fuelTypes: 'Electric',
                })
                    .populate('brand', 'name slug')
                    .select('name slug brand priceRange')
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ models: evModels, count: evModels.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://upcoming') {
                const upcomingModels = await Model.find({
                    status: 'upcoming',
                })
                    .populate('brand', 'name slug')
                    .select('name slug brand expectedLaunchDate')
                    .sort({ expectedLaunchDate: 1 })
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ models: upcomingModels, count: upcomingModels.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://news') {
                const news = await News.find({ status: 'published' })
                    .select('title slug excerpt publishedAt')
                    .sort({ publishedAt: -1 })
                    .limit(20)
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ articles: news, count: news.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri === 'killerwhale://stats') {
                const stats = {
                    brands: await Brand.countDocuments({ status: 'active' }),
                    models: await Model.countDocuments({ status: 'active' }),
                    variants: await Variant.countDocuments({ status: 'active' }),
                    news: await News.countDocuments({ status: 'published' }),
                    timestamp: new Date().toISOString(),
                };

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify(stats, null, 2),
                        },
                    ],
                };
            }

            // Handle dynamic URIs (e.g., killerwhale://brands/hyundai)
            if (uri.startsWith('killerwhale://brands/')) {
                const slug = uri.replace('killerwhale://brands/', '');
                const brand = await Brand.findOne({ slug, status: 'active' }).lean();

                if (!brand) {
                    throw new Error(`Brand not found: ${slug}`);
                }

                const models = await Model.find({ brand: brand._id, status: 'active' })
                    .select('name slug priceRange fuelTypes')
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ brand, models, modelCount: models.length }, null, 2),
                        },
                    ],
                };
            }

            if (uri.startsWith('killerwhale://models/')) {
                const slug = uri.replace('killerwhale://models/', '');
                const model = await Model.findOne({ slug, status: 'active' })
                    .populate('brand', 'name slug')
                    .lean();

                if (!model) {
                    throw new Error(`Model not found: ${slug}`);
                }

                const variants = await Variant.find({ model: model._id, status: 'active' })
                    .select('name price fuelType transmission')
                    .lean();

                return {
                    contents: [
                        {
                            uri,
                            mimeType: 'application/json',
                            text: JSON.stringify({ model, variants, variantCount: variants.length }, null, 2),
                        },
                    ],
                };
            }

            throw new Error(`Unknown resource URI: ${uri}`);
        });

        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'search_cars',
                        description: 'Search for cars with filters (budget, fuel type, seating, body type)',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                budget: {
                                    type: 'object',
                                    properties: {
                                        min: { type: 'number', description: 'Minimum price in lakhs' },
                                        max: { type: 'number', description: 'Maximum price in lakhs' },
                                    },
                                },
                                fuelType: {
                                    type: 'string',
                                    enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
                                    description: 'Fuel type filter',
                                },
                                seating: {
                                    type: 'number',
                                    description: 'Number of seats (5, 7, etc.)',
                                },
                                bodyType: {
                                    type: 'string',
                                    enum: ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Convertible'],
                                    description: 'Body type filter',
                                },
                                transmission: {
                                    type: 'string',
                                    enum: ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT'],
                                    description: 'Transmission type',
                                },
                            },
                        },
                    },
                    {
                        name: 'compare_cars',
                        description: 'Compare multiple car models side-by-side',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                modelSlugs: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'Array of model slugs to compare (max 4)',
                                    maxItems: 4,
                                    minItems: 2,
                                },
                            },
                            required: ['modelSlugs'],
                        },
                    },
                    {
                        name: 'calculate_emi',
                        description: 'Calculate EMI for a car variant',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                price: {
                                    type: 'number',
                                    description: 'Ex-showroom price in lakhs',
                                },
                                downPayment: {
                                    type: 'number',
                                    description: 'Down payment percentage (0-100)',
                                    default: 20,
                                },
                                tenure: {
                                    type: 'number',
                                    description: 'Loan tenure in years',
                                    default: 5,
                                },
                                interestRate: {
                                    type: 'number',
                                    description: 'Annual interest rate percentage',
                                    default: 8.5,
                                },
                            },
                            required: ['price'],
                        },
                    },
                    {
                        name: 'get_platform_stats',
                        description: 'Get platform statistics and performance metrics',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                period: {
                                    type: 'string',
                                    enum: ['today', 'week', 'month'],
                                    default: 'today',
                                },
                            },
                        },
                    },
                    {
                        name: 'check_seo_health',
                        description: 'Check SEO health of the platform',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                detailed: {
                                    type: 'boolean',
                                    description: 'Include detailed page-by-page analysis',
                                    default: false,
                                },
                            },
                        },
                    },
                ],
            };
        });

        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            if (name === 'search_cars') {
                return await this.handleSearchCars(args);
            }

            if (name === 'compare_cars') {
                return await this.handleCompareCars(args);
            }

            if (name === 'calculate_emi') {
                return await this.handleCalculateEMI(args);
            }

            if (name === 'get_platform_stats') {
                return await this.handleGetPlatformStats(args);
            }

            if (name === 'check_seo_health') {
                return await this.handleCheckSEOHealth(args);
            }

            throw new Error(`Unknown tool: ${name}`);
        });

        // List available prompts
        this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
            return {
                prompts: [
                    {
                        name: 'recommend_family_car',
                        description: 'Recommend best family cars based on budget and requirements',
                        arguments: [
                            {
                                name: 'budget',
                                description: 'Budget in lakhs',
                                required: true,
                            },
                            {
                                name: 'seating',
                                description: 'Number of seats required (5 or 7)',
                                required: false,
                            },
                        ],
                    },
                    {
                        name: 'daily_performance_check',
                        description: 'Generate daily performance dashboard',
                        arguments: [],
                    },
                    {
                        name: 'seo_health_scan',
                        description: 'Comprehensive SEO health check',
                        arguments: [],
                    },
                ],
            };
        });

        // Handle prompt requests
        this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            if (name === 'recommend_family_car') {
                const budget = args?.budget || 15;
                const seating = args?.seating || 5;

                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: `Find the best family cars under ₹${budget} lakhs with ${seating} seats. Consider safety, mileage, space, and value for money. Provide top 3 recommendations with detailed comparison.`,
                            },
                        },
                    ],
                };
            }

            if (name === 'daily_performance_check') {
                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: 'Generate a comprehensive daily performance report including: traffic stats, top performing models, lead generation, SEO status, and any issues that need attention.',
                            },
                        },
                    ],
                };
            }

            if (name === 'seo_health_scan') {
                return {
                    messages: [
                        {
                            role: 'user',
                            content: {
                                type: 'text',
                                text: 'Perform a comprehensive SEO health check. Check for missing meta tags, broken links, image optimization, page speed, and provide actionable recommendations.',
                            },
                        },
                    ],
                };
            }

            throw new Error(`Unknown prompt: ${name}`);
        });
    }

    // Tool implementation methods
    private async handleSearchCars(args: any) {
        const query: any = { status: 'active' };

        // Budget filter
        if (args.budget) {
            const { min, max } = args.budget;
            if (min !== undefined || max !== undefined) {
                query['priceRange.min'] = {};
                if (min) query['priceRange.min'].$gte = min * 100000;
                if (max) query['priceRange.max'] = { $lte: max * 100000 };
            }
        }

        // Fuel type filter
        if (args.fuelType) {
            query.fuelTypes = args.fuelType;
        }

        // Seating filter
        if (args.seating) {
            query.seatingCapacity = args.seating;
        }

        // Body type filter
        if (args.bodyType) {
            query.bodyType = args.bodyType;
        }

        // Transmission filter
        if (args.transmission) {
            query.transmissionTypes = args.transmission;
        }

        const models = await Model.find(query)
            .populate('brand', 'name slug')
            .select('name slug brand priceRange fuelTypes seatingCapacity bodyType mileage')
            .limit(50)
            .lean();

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            results: models,
                            count: models.length,
                            filters: args,
                        },
                        null,
                        2
                    ),
                },
            ],
        };
    }

    private async handleCompareCars(args: any) {
        const { modelSlugs } = args;

        if (!modelSlugs || modelSlugs.length < 2) {
            throw new Error('At least 2 model slugs required for comparison');
        }

        if (modelSlugs.length > 4) {
            throw new Error('Maximum 4 models can be compared');
        }

        const models = await Model.find({ slug: { $in: modelSlugs }, status: 'active' })
            .populate('brand', 'name slug')
            .lean();

        if (models.length !== modelSlugs.length) {
            throw new Error('One or more models not found');
        }

        // Get variants for each model
        const modelsWithVariants = await Promise.all(
            models.map(async (model) => {
                const variants = await Variant.find({ model: model._id, status: 'active' })
                    .select('name price fuelType transmission mileage')
                    .lean();
                return { ...model, variants };
            })
        );

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            comparison: modelsWithVariants,
                            count: modelsWithVariants.length,
                        },
                        null,
                        2
                    ),
                },
            ],
        };
    }

    private async handleCalculateEMI(args: any) {
        const { price, downPayment = 20, tenure = 5, interestRate = 8.5 } = args;

        const priceInRupees = price * 100000;
        const downPaymentAmount = (priceInRupees * downPayment) / 100;
        const loanAmount = priceInRupees - downPaymentAmount;
        const monthlyRate = interestRate / 12 / 100;
        const months = tenure * 12;

        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

        const totalPayment = emi * months;
        const totalInterest = totalPayment - loanAmount;

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            exShowroomPrice: priceInRupees,
                            downPayment: {
                                percentage: downPayment,
                                amount: downPaymentAmount,
                            },
                            loanAmount,
                            emi: Math.round(emi),
                            tenure: {
                                years: tenure,
                                months,
                            },
                            interestRate,
                            totalPayment: Math.round(totalPayment),
                            totalInterest: Math.round(totalInterest),
                        },
                        null,
                        2
                    ),
                },
            ],
        };
    }

    private async handleGetPlatformStats(args: any) {
        const stats = {
            database: {
                brands: await Brand.countDocuments({ status: 'active' }),
                models: await Model.countDocuments({ status: 'active' }),
                variants: await Variant.countDocuments({ status: 'active' }),
                news: await News.countDocuments({ status: 'published' }),
            },
            cache: {
                connected: this.redisClient.isOpen,
            },
            timestamp: new Date().toISOString(),
            period: args.period || 'today',
        };

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(stats, null, 2),
                },
            ],
        };
    }

    private async handleCheckSEOHealth(args: any) {
        const models = await Model.find({ status: 'active' })
            .select('name slug seo')
            .limit(args.detailed ? 1000 : 100)
            .lean();

        const issues = {
            missingMetaTitle: 0,
            missingMetaDescription: 0,
            missingH1: 0,
            total: models.length,
        };

        models.forEach((model: any) => {
            if (!model.seo?.metaTitle) issues.missingMetaTitle++;
            if (!model.seo?.metaDescription) issues.missingMetaDescription++;
            if (!model.seo?.h1) issues.missingH1++;
        });

        const score = Math.round(
            ((models.length - issues.missingMetaTitle - issues.missingMetaDescription - issues.missingH1) / (models.length * 3)) * 100
        );

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            score,
                            issues,
                            recommendations: [
                                issues.missingMetaTitle > 0 && `Add meta titles to ${issues.missingMetaTitle} pages`,
                                issues.missingMetaDescription > 0 && `Add meta descriptions to ${issues.missingMetaDescription} pages`,
                                issues.missingH1 > 0 && `Add H1 tags to ${issues.missingH1} pages`,
                            ].filter(Boolean),
                        },
                        null,
                        2
                    ),
                },
            ],
        };
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('🚀 Killerwhale MCP Server running on stdio');
    }
}

// Start the server
const server = new KillerWhaleMCPServer();
server
    .initialize()
    .then(() => server.run())
    .catch((error) => {
        console.error('❌ Failed to start MCP server:', error);
        process.exit(1);
    });
