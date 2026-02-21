/**
 * Admin route for humanizing AI-generated content
 * 
 * Processes all models and brands to make content more neutral and human-like
 */

import { Router, Request, Response } from 'express';
import { Model, Brand, UpcomingCar, Variant } from '../db/schemas';
import {
    humanizeContent,
    humanizeEngineSummaries,
    testHumanizer
} from '../utils/content-humanizer';
import { authenticateToken } from '../auth';

const router = Router();

// Test humanizer on sample text
router.post('/test', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const result = testHumanizer(text);

        res.json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('Test humanizer error:', error);
        res.status(500).json({ error: 'Failed to test humanizer' });
    }
});

// Humanize all brands
router.post('/brands', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🔄 Starting brand content humanization...');

        const brands = await Brand.find({});
        let updatedCount = 0;
        let skippedCount = 0;
        const results: Array<{ name: string; updated: boolean; sample?: string }> = [];

        for (const brand of brands) {
            if (!brand.summary) {
                skippedCount++;
                results.push({ name: brand.name, updated: false });
                continue;
            }

            const humanizedSummary = humanizeContent(brand.summary);

            // Only update if content actually changed
            if (humanizedSummary !== brand.summary) {
                await Brand.updateOne(
                    { _id: brand._id },
                    { $set: { summary: humanizedSummary } }
                );
                updatedCount++;
                results.push({
                    name: brand.name,
                    updated: true,
                    sample: humanizedSummary.substring(0, 100) + '...'
                });
            } else {
                skippedCount++;
                results.push({ name: brand.name, updated: false });
            }
        }

        console.log(`✅ Brand humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);

        res.json({
            success: true,
            summary: {
                total: brands.length,
                updated: updatedCount,
                skipped: skippedCount
            },
            results
        });
    } catch (error) {
        console.error('Brand humanization error:', error);
        res.status(500).json({ error: 'Failed to humanize brand content' });
    }
});

// Humanize all models
router.post('/models', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🔄 Starting model content humanization...');

        const models = await Model.find({});
        let updatedCount = 0;
        let skippedCount = 0;
        const results: Array<{ name: string; updated: boolean; fields?: string[] }> = [];

        for (const model of models) {
            const updates: Record<string, any> = {};
            const updatedFields: string[] = [];

            // Humanize each text field
            const fieldsToHumanize = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fieldsToHumanize) {
                const original = (model as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                        updatedFields.push(field);
                    }
                }
            }

            // Humanize engine summaries
            if (model.engineSummaries && model.engineSummaries.length > 0) {
                const humanizedEngines = humanizeEngineSummaries(model.engineSummaries as any);

                // Check if any engine summary changed
                const engineChanged = humanizedEngines.some((he, i) =>
                    he.summary !== (model.engineSummaries?.[i] as any)?.summary
                );

                if (engineChanged) {
                    updates.engineSummaries = humanizedEngines;
                    updatedFields.push('engineSummaries');
                }
            }

            // Update if any changes
            if (Object.keys(updates).length > 0) {
                await Model.updateOne(
                    { _id: model._id },
                    { $set: updates }
                );
                updatedCount++;
                results.push({ name: model.name, updated: true, fields: updatedFields });
            } else {
                skippedCount++;
                results.push({ name: model.name, updated: false });
            }
        }

        console.log(`✅ Model humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);

        res.json({
            success: true,
            summary: {
                total: models.length,
                updated: updatedCount,
                skipped: skippedCount
            },
            results
        });
    } catch (error) {
        console.error('Model humanization error:', error);
        res.status(500).json({ error: 'Failed to humanize model content' });
    }
});

// Humanize all upcoming cars
router.post('/upcoming', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🔄 Starting upcoming car content humanization...');

        const upcomingCars = await UpcomingCar.find({});
        let updatedCount = 0;
        let skippedCount = 0;
        const results: Array<{ name: string; updated: boolean; fields?: string[] }> = [];

        for (const car of upcomingCars) {
            const updates: Record<string, any> = {};
            const updatedFields: string[] = [];

            // Humanize each text field
            const fieldsToHumanize = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fieldsToHumanize) {
                const original = (car as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                        updatedFields.push(field);
                    }
                }
            }

            // Humanize engine summaries
            if (car.engineSummaries && car.engineSummaries.length > 0) {
                const humanizedEngines = humanizeEngineSummaries(car.engineSummaries as any);

                const engineChanged = humanizedEngines.some((he, i) =>
                    he.summary !== (car.engineSummaries?.[i] as any)?.summary
                );

                if (engineChanged) {
                    updates.engineSummaries = humanizedEngines;
                    updatedFields.push('engineSummaries');
                }
            }

            // Update if any changes
            if (Object.keys(updates).length > 0) {
                await UpcomingCar.updateOne(
                    { _id: car._id },
                    { $set: updates }
                );
                updatedCount++;
                results.push({ name: car.name, updated: true, fields: updatedFields });
            } else {
                skippedCount++;
                results.push({ name: car.name, updated: false });
            }
        }

        console.log(`✅ Upcoming car humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);

        res.json({
            success: true,
            summary: {
                total: upcomingCars.length,
                updated: updatedCount,
                skipped: skippedCount
            },
            results
        });
    } catch (error) {
        console.error('Upcoming car humanization error:', error);
        res.status(500).json({ error: 'Failed to humanize upcoming car content' });
    }
});

// Humanize all variants
router.post('/variants', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🔄 Starting variant content humanization...');

        const variants = await Variant.find({});
        let updatedCount = 0;
        let skippedCount = 0;

        for (const variant of variants) {
            const updates: Record<string, any> = {};

            // Humanize each text field for variants
            const fieldsToHumanize = [
                'description', 'headerSummary', 'keyFeatures',
                'exteriorDesign', 'comfortConvenience', 'engineSummary'
            ];

            for (const field of fieldsToHumanize) {
                const original = (variant as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                    }
                }
            }

            // Update if any changes
            if (Object.keys(updates).length > 0) {
                await Variant.updateOne(
                    { _id: variant._id },
                    { $set: updates }
                );
                updatedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`✅ Variant humanization complete: ${updatedCount} updated, ${skippedCount} skipped`);

        res.json({
            success: true,
            summary: {
                total: variants.length,
                updated: updatedCount,
                skipped: skippedCount
            }
        });
    } catch (error) {
        console.error('Variant humanization error:', error);
        res.status(500).json({ error: 'Failed to humanize variant content' });
    }
});

// Humanize ALL content (brands + models + upcoming + variants)
router.post('/all', authenticateToken, async (req: Request, res: Response) => {
    try {
        console.log('🔄 Starting FULL content humanization...');

        const results = {
            brands: { total: 0, updated: 0, skipped: 0 },
            models: { total: 0, updated: 0, skipped: 0 },
            upcomingCars: { total: 0, updated: 0, skipped: 0 },
            variants: { total: 0, updated: 0, skipped: 0 }
        };

        // Process Brands
        const brands = await Brand.find({});
        results.brands.total = brands.length;

        for (const brand of brands) {
            if (brand.summary) {
                const humanized = humanizeContent(brand.summary);
                if (humanized !== brand.summary) {
                    await Brand.updateOne({ _id: brand._id }, { $set: { summary: humanized } });
                    results.brands.updated++;
                } else {
                    results.brands.skipped++;
                }
            } else {
                results.brands.skipped++;
            }
        }

        // Process Models
        const models = await Model.find({});
        results.models.total = models.length;

        for (const model of models) {
            const updates: Record<string, any> = {};
            const fieldsToHumanize = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fieldsToHumanize) {
                const original = (model as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                    }
                }
            }

            if (model.engineSummaries && model.engineSummaries.length > 0) {
                const humanized = humanizeEngineSummaries(model.engineSummaries as any);
                const changed = humanized.some((h, i) => h.summary !== (model.engineSummaries?.[i] as any)?.summary);
                if (changed) updates.engineSummaries = humanized;
            }

            if (Object.keys(updates).length > 0) {
                await Model.updateOne({ _id: model._id }, { $set: updates });
                results.models.updated++;
            } else {
                results.models.skipped++;
            }
        }

        // Process Upcoming Cars
        const upcomingCars = await UpcomingCar.find({});
        results.upcomingCars.total = upcomingCars.length;

        for (const car of upcomingCars) {
            const updates: Record<string, any> = {};
            const fieldsToHumanize = ['summary', 'description', 'exteriorDesign', 'comfortConvenience', 'pros', 'headerSeo'];

            for (const field of fieldsToHumanize) {
                const original = (car as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                    }
                }
            }

            if (car.engineSummaries && car.engineSummaries.length > 0) {
                const humanized = humanizeEngineSummaries(car.engineSummaries as any);
                const changed = humanized.some((h, i) => h.summary !== (car.engineSummaries?.[i] as any)?.summary);
                if (changed) updates.engineSummaries = humanized;
            }

            if (Object.keys(updates).length > 0) {
                await UpcomingCar.updateOne({ _id: car._id }, { $set: updates });
                results.upcomingCars.updated++;
            } else {
                results.upcomingCars.skipped++;
            }
        }

        // Process Variants
        const variants = await Variant.find({});
        results.variants.total = variants.length;

        for (const variant of variants) {
            const updates: Record<string, any> = {};
            const fieldsToHumanize = ['description', 'headerSummary', 'keyFeatures', 'exteriorDesign', 'comfortConvenience', 'engineSummary'];

            for (const field of fieldsToHumanize) {
                const original = (variant as any)[field];
                if (original && typeof original === 'string') {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        updates[field] = humanized;
                    }
                }
            }

            if (Object.keys(updates).length > 0) {
                await Variant.updateOne({ _id: variant._id }, { $set: updates });
                results.variants.updated++;
            } else {
                results.variants.skipped++;
            }
        }

        const totalUpdated = results.brands.updated + results.models.updated + results.upcomingCars.updated + results.variants.updated;
        console.log(`✅ Full humanization complete: ${totalUpdated} items updated`);

        res.json({
            success: true,
            message: `Humanized ${totalUpdated} items across all collections`,
            results
        });
    } catch (error) {
        console.error('Full humanization error:', error);
        res.status(500).json({ error: 'Failed to humanize all content' });
    }
});

// Preview humanization without saving (dry run)
router.post('/preview', authenticateToken, async (req: Request, res: Response) => {
    try {
        const { type = 'models', limit = 5 } = req.body;

        console.log(`🔍 Previewing humanization for ${type} (limit: ${limit})...`);

        const previews: Array<{
            name: string;
            field: string;
            before: string;
            after: string;
        }> = [];

        let items: any[] = [];
        let fieldsToPreview: string[] = [];

        switch (type) {
            case 'brands':
                items = await Brand.find({}).limit(limit);
                fieldsToPreview = ['summary'];
                break;
            case 'models':
                items = await Model.find({}).limit(limit);
                fieldsToPreview = ['summary', 'description'];
                break;
            case 'variants':
                items = await Variant.find({}).limit(limit);
                fieldsToPreview = ['description', 'headerSummary'];
                break;
            default:
                return res.status(400).json({ error: 'Invalid type. Use: brands, models, or variants' });
        }

        for (const item of items) {
            for (const field of fieldsToPreview) {
                const original = item[field];
                if (original && typeof original === 'string' && original.length > 50) {
                    const humanized = humanizeContent(original);
                    if (humanized !== original) {
                        previews.push({
                            name: item.name,
                            field,
                            before: original.substring(0, 200) + (original.length > 200 ? '...' : ''),
                            after: humanized.substring(0, 200) + (humanized.length > 200 ? '...' : '')
                        });
                    }
                }
            }
        }

        res.json({
            success: true,
            type,
            previewCount: previews.length,
            previews
        });
    } catch (error) {
        console.error('Preview error:', error);
        res.status(500).json({ error: 'Failed to generate preview' });
    }
});

export default router;
