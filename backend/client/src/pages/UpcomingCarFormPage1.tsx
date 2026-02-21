import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useUpcomingCarForm } from "@/contexts/UpcomingCarFormContext";
import type { Brand, UpcomingCar } from "@shared/schema";

export default function UpcomingCarFormPage1() {
    const [, setLocation] = useLocation();
    const params = useParams();
    const { formData, updateFormData, resetFormData, saveProgress, isEditMode: contextIsEditMode, setEditMode } = useUpcomingCarForm();
    const isEditMode = !!params.id;
    const editingCarId = params.id;

    const { data: brands = [], isLoading: brandsLoading } = useQuery<Brand[]>({
        queryKey: ['/api/brands'],
    });

    // Fetch existing car data if in edit mode
    const { data: existingCar, isLoading: carLoading } = useQuery<UpcomingCar>({
        queryKey: ['/api/upcoming-cars', editingCarId],
        enabled: isEditMode && !!editingCarId,
    });

    const [localData, setLocalData] = useState({
        brandId: '',
        name: '',
        isPopular: false,
        isNew: false,
        popularRank: null as number | null,
        newRank: null as number | null,
        bodyType: '',
        subBodyType: '',
        expectedLaunchDate: '',
        expectedPriceMin: null as number | null,
        expectedPriceMax: null as number | null,
        fuelTypes: [] as string[],
        transmissions: [] as string[],
        brochureFile: null as File | null,
        headerSeo: '',
        pros: '',
        cons: '',
        description: '',
        exteriorDesign: '',
        comfortConvenience: '',
    });

    // Set edit mode in context
    useEffect(() => {
        if (isEditMode && editingCarId) {
            setEditMode(true, editingCarId);
        } else {
            setEditMode(false);
        }
    }, [isEditMode, editingCarId, setEditMode]);

    // Load existing car data when in edit mode
    useEffect(() => {
        if (isEditMode && existingCar && existingCar.id && !carLoading) {
            console.log('Loading existing upcoming car data:', existingCar);
            setLocalData({
                brandId: existingCar.brandId || '',
                name: existingCar.name || '',
                isPopular: existingCar.isPopular || false,
                isNew: existingCar.isNew || false,
                popularRank: existingCar.popularRank,
                newRank: existingCar.newRank,
                bodyType: existingCar.bodyType || '',
                subBodyType: existingCar.subBodyType || '',
                expectedLaunchDate: existingCar.expectedLaunchDate || '',
                expectedPriceMin: existingCar.expectedPriceMin,
                expectedPriceMax: existingCar.expectedPriceMax,
                fuelTypes: existingCar.fuelTypes || [],
                transmissions: existingCar.transmissions || [],
                brochureFile: null,
                headerSeo: existingCar.headerSeo || '',
                pros: existingCar.pros || '',
                cons: existingCar.cons || '',
                description: existingCar.description || '',
                exteriorDesign: existingCar.exteriorDesign || '',
                comfortConvenience: existingCar.comfortConvenience || '',
            });
            // Also update the form context with existing data (only if different)
            if (!(formData as any).id || (formData as any).id !== existingCar.id) {
                updateFormData(existingCar);
            }
        } else if (!isEditMode && (formData as any).id) {
            // Reset form data when switching from edit to create mode
            resetFormData();
            setLocalData({
                brandId: '',
                name: '',
                isPopular: false,
                isNew: false,
                popularRank: null,
                newRank: null,
                bodyType: '',
                subBodyType: '',
                expectedLaunchDate: '',
                expectedPriceMin: null,
                expectedPriceMax: null,
                fuelTypes: [],
                transmissions: [],
                brochureFile: null,
                headerSeo: '',
                pros: '',
                cons: '',
                description: '',
                exteriorDesign: '',
                comfortConvenience: '',
            });
        }
    }, [isEditMode, existingCar?.id, carLoading]);

    // Generate ID preview (just for display, backend generates actual ID)
    const generateIdPreview = (brandName: string, carName: string) => {
        if (!brandName || !carName) return '';
        const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const carSlug = carName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        return `upcoming-brand-${brandSlug}-${carSlug}`;
    };

    const [generatedId, setGeneratedId] = useState('');

    useEffect(() => {
        const selectedBrand = brands.find(b => b.id === localData.brandId);
        if (selectedBrand && localData.name) {
            const newId = generateIdPreview(selectedBrand.name, localData.name);
            setGeneratedId(newId);
        }
    }, [localData.brandId, localData.name, brands]);

    const handleNext = async () => {
        console.log('Page 1 - Saving data:', localData);

        // Validate required fields
        if (!localData.brandId || !localData.name) {
            alert('Please fill in all required fields (Brand and Name).');
            return;
        }

        // Validate price range
        if (localData.expectedPriceMin && localData.expectedPriceMax) {
            if (localData.expectedPriceMax < localData.expectedPriceMin) {
                alert('Maximum price must be greater than or equal to minimum price.');
                return;
            }
        }

        try {
            // Save progress to backend
            const carId = await saveProgress(localData);
            console.log('Upcoming car saved with ID:', carId);

            // Navigate to next page
            if (isEditMode || carId) {
                setLocation(`/upcoming-cars/${carId}/edit/page2`);
            } else {
                setLocation('/upcoming-cars/new/page2');
            }
        } catch (error) {
            console.error('Failed to save upcoming car:', error);
            alert('Failed to save progress. Please try again.');
        }
    };

    if (brandsLoading || (isEditMode && carLoading)) {
        return (
            <div className="p-8">
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="space-y-6 max-w-6xl">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{isEditMode ? 'Edit Upcoming Car' : 'Add New Upcoming Car'}</h1>
                    <div className="flex items-center gap-2">
                        <Label className="text-sm font-normal">ID Preview</Label>
                        <Input
                            value={isEditMode ? editingCarId : generatedId}
                            disabled
                            className="w-64 font-mono text-xs bg-muted"
                            data-testid="input-car-id"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="button"
                        variant="default"
                        data-testid="button-activate"
                    >
                        Activate
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        data-testid="button-deactivate"
                    >
                        Deactivate
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Select Brand</Label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={localData.brandId}
                            onChange={(e) => setLocalData({ ...localData, brandId: e.target.value })}
                            data-testid="select-brand"
                        >
                            <option value="">Select a brand...</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPopular"
                                checked={localData.isPopular}
                                onChange={(e) => setLocalData({ ...localData, isPopular: e.target.checked })}
                                className="w-4 h-4"
                                data-testid="checkbox-is-popular"
                            />
                            <Label htmlFor="isPopular" className="font-normal">Is Popular</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isNew"
                                checked={localData.isNew}
                                onChange={(e) => setLocalData({ ...localData, isNew: e.target.checked })}
                                className="w-4 h-4"
                                data-testid="checkbox-is-new"
                            />
                            <Label htmlFor="isNew" className="font-normal">Is New</Label>
                        </div>
                    </div>
                </div>

                {localData.isPopular && (
                    <div className="space-y-2">
                        <Label>Popular Ranking (1-20)</Label>
                        <select
                            className="w-full md:w-48 px-3 py-2 border rounded-md"
                            value={localData.popularRank || ''}
                            onChange={(e) => setLocalData({ ...localData, popularRank: e.target.value ? parseInt(e.target.value) : null })}
                            data-testid="select-popular-rank"
                        >
                            <option value="">Select...</option>
                            {Array.from({ length: 20 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                )}

                {localData.isNew && (
                    <div className="space-y-2">
                        <Label>New Ranking (1-20)</Label>
                        <select
                            className="w-full md:w-48 px-3 py-2 border rounded-md"
                            value={localData.newRank || ''}
                            onChange={(e) => setLocalData({ ...localData, newRank: e.target.value ? parseInt(e.target.value) : null })}
                            data-testid="select-new-rank"
                        >
                            <option value="">Select...</option>
                            {Array.from({ length: 20 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Body Type</Label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={localData.bodyType}
                            onChange={(e) => setLocalData({ ...localData, bodyType: e.target.value })}
                            data-testid="select-body-type"
                        >
                            <option value="">List</option>
                            <option value="SUV">SUV</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Hatchback">Hatchback</option>
                            <option value="MPV">MPV</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Convertible">Convertible</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sub-body Type</Label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={localData.subBodyType}
                            onChange={(e) => setLocalData({ ...localData, subBodyType: e.target.value })}
                            data-testid="select-subbody-type"
                        >
                            <option value="">List</option>
                            <option value="Premium Level">Premium Level</option>
                            <option value="Mid Level">Mid Level</option>
                            <option value="Entry Level">Entry Level</option>
                            <option value="Electric Entry Level">Electric Entry Level</option>
                            <option value="Mid Size">Mid Size</option>
                            <option value="Entry Level Luxury">Entry Level Luxury</option>
                            <option value="Compact Luxury">Compact Luxury</option>
                            <option value="Compact">Compact</option>
                            <option value="Full Size Luxury">Full Size Luxury</option>
                            <option value="Flagship Luxury Electric">Flagship Luxury Electric</option>
                            <option value="Flagship Luxury">Flagship Luxury</option>
                            <option value="Sports Car">Sports Car</option>
                            <option value="Compact Luxury Electric">Compact Luxury Electric</option>
                            <option value="Luxury Entry Level">Luxury Entry Level</option>
                            <option value="Luxury Electric Entry Level">Luxury Electric Entry Level</option>
                            <option value="Luxury Sports">Luxury Sports</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            placeholder="e.g. Harrier EV"
                            value={localData.name}
                            onChange={(e) => setLocalData({ ...localData, name: e.target.value })}
                            data-testid="input-name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Expected Launch Date</Label>
                        <Input
                            type="month"
                            placeholder="Calendar popup"
                            value={localData.expectedLaunchDate}
                            onChange={(e) => setLocalData({ ...localData, expectedLaunchDate: e.target.value })}
                            data-testid="input-expected-launch-date"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Upload Brochure</Label>
                        <label className="flex items-center justify-center h-10 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                            <Upload className="w-4 h-4 mr-2" />
                            <span className="text-sm">{localData.brochureFile ? localData.brochureFile.name : 'Upload PDF'}</span>
                            <input
                                type="file"
                                className="hidden"
                                accept=".pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.type !== 'application/pdf') {
                                            alert('Please select a PDF file only');
                                            return;
                                        }
                                        if (file.size > 5 * 1024 * 1024) {
                                            alert('File size must be less than 5MB');
                                            return;
                                        }
                                        setLocalData({ ...localData, brochureFile: file });
                                    }
                                }}
                                data-testid="input-brochure"
                            />
                        </label>
                        {localData.brochureFile && (
                            <p className="text-xs text-green-600">✓ {localData.brochureFile.name} selected</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Expected Price Min (₹)</Label>
                        <Input
                            type="number"
                            placeholder="Minimum price"
                            value={localData.expectedPriceMin || ''}
                            onChange={(e) => setLocalData({ ...localData, expectedPriceMin: e.target.value ? parseFloat(e.target.value) : null })}
                            data-testid="input-expected-price-min"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Expected Price Max (₹)</Label>
                        <Input
                            type="number"
                            placeholder="Maximum price"
                            value={localData.expectedPriceMax || ''}
                            onChange={(e) => setLocalData({ ...localData, expectedPriceMax: e.target.value ? parseFloat(e.target.value) : null })}
                            data-testid="input-expected-price-max"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Fuel Type</Label>
                        <div className="border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto bg-white">
                            {['petrol', 'diesel', 'electric', 'hybrid', 'cng'].map((fuel) => (
                                <div key={fuel} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`fuel-${fuel}`}
                                        checked={localData.fuelTypes.includes(fuel)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setLocalData({ ...localData, fuelTypes: [...localData.fuelTypes, fuel] });
                                            } else {
                                                setLocalData({ ...localData, fuelTypes: localData.fuelTypes.filter(f => f !== fuel) });
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor={`fuel-${fuel}`} className="font-normal capitalize text-sm">{fuel}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Transmission</Label>
                        <div className="border rounded-md p-3 space-y-2 max-h-32 overflow-y-auto bg-white">
                            {['manual', 'automatic', 'cvt', 'amt', 'dct', 'imt'].map((transmission) => (
                                <div key={transmission} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`transmission-${transmission}`}
                                        checked={localData.transmissions.includes(transmission)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setLocalData({ ...localData, transmissions: [...localData.transmissions, transmission] });
                                            } else {
                                                setLocalData({ ...localData, transmissions: localData.transmissions.filter(t => t !== transmission) });
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    <Label htmlFor={`transmission-${transmission}`} className="font-normal uppercase text-sm">{transmission}</Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Header SEO text</Label>
                    <RichTextEditor
                        value={localData.headerSeo}
                        onChange={(value) => setLocalData({ ...localData, headerSeo: value })}
                        placeholder="Long Text Field"
                    />
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Pro's & Cons</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Pro's</Label>
                            <RichTextEditor
                                value={localData.pros}
                                onChange={(value) => setLocalData({ ...localData, pros: value })}
                                placeholder="Long Text Field"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Con's</Label>
                            <RichTextEditor
                                value={localData.cons}
                                onChange={(value) => setLocalData({ ...localData, cons: value })}
                                placeholder="Long Text Field"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label className="text-base font-semibold">Summary</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <RichTextEditor
                                value={localData.description}
                                onChange={(value) => setLocalData({ ...localData, description: value })}
                                placeholder="Long Text Field"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Exterior Design</Label>
                            <RichTextEditor
                                value={localData.exteriorDesign}
                                onChange={(value) => setLocalData({ ...localData, exteriorDesign: value })}
                                placeholder="Long Text Field"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Comfort & Convenience</Label>
                        <RichTextEditor
                            value={localData.comfortConvenience}
                            onChange={(value) => setLocalData({ ...localData, comfortConvenience: value })}
                            placeholder="Long Text Field"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleNext} data-testid="button-next-page">
                        Next Page
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    );
}
