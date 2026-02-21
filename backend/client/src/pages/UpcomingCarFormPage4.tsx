import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { useLocation, useParams } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUpcomingCarForm } from "@/contexts/UpcomingCarFormContext";
import { uploadMultipleImages } from "@/lib/imageUpload";
import type { InsertUpcomingCar } from "@shared/schema";

interface ImageData {
    id: string;
    caption: string;
    file?: File;
    previewUrl?: string;
}

export default function UpcomingCarFormPage4() {
    const [, setLocation] = useLocation();
    const params = useParams();
    const { toast } = useToast();
    const { formData, updateFormData, resetFormData } = useUpcomingCarForm();
    const [colorImages, setColorImages] = useState<ImageData[]>(() => {
        if (Array.isArray(formData.colorImages) && formData.colorImages.length > 0) {
            return (formData.colorImages as any[]).map((item: any, index) => ({
                id: item.id || `color-${index}`,
                caption: item.caption || '',
                previewUrl: item.url || '',
                file: undefined
            }));
        }
        return [{ id: 'color-1', caption: '', previewUrl: '', file: undefined }, { id: 'color-2', caption: '', previewUrl: '', file: undefined }];
    });

    const isEditMode = !!params.id;
    const carId = params.id;

    // Load color images from formData when in edit mode (one-way sync)
    useEffect(() => {
        if (isEditMode && Array.isArray(formData.colorImages) && formData.colorImages.length > 0) {
            console.log('📥 Loading color images from formData:', formData.colorImages.length, 'images');
            setColorImages((formData.colorImages as any[]).map((item: any, index) => ({
                id: item.id || `color-${index}`,
                caption: item.caption || '',
                previewUrl: item.url || '',
                file: undefined
            })));
        }
    }, [isEditMode, formData.colorImages]);

    const saveUpcomingCar = useMutation({
        mutationFn: async (data: InsertUpcomingCar) => {
            if (isEditMode) {
                return await apiRequest('PATCH', `/api/upcoming-cars/${carId}`, data);
            } else {
                return await apiRequest('POST', '/api/upcoming-cars', data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/upcoming-cars'] });
            toast({
                title: isEditMode ? "Upcoming Car updated" : "Upcoming Car created",
                description: `The upcoming car has been successfully ${isEditMode ? 'updated' : 'created'}.`,
            });
            if (!isEditMode) {
                resetFormData();
            }
            setLocation('/upcoming-cars');
        },
        onError: () => {
            toast({
                title: "Error",
                description: `Failed to ${isEditMode ? 'update' : 'create'} upcoming car. Please check all required fields.`,
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async () => {
        // Prevent double submission
        if (saveUpcomingCar.isPending) {
            console.log('Submission already in progress, ignoring...');
            return;
        }

        if (!formData.brandId || !formData.name) {
            toast({
                title: "Missing information",
                description: "Please fill in the brand and upcoming car name.",
                variant: "destructive",
            });
            setLocation(isEditMode ? `/upcoming-cars/${carId}/edit` : '/upcoming-cars/new');
            return;
        }

        try {
            console.log('🚀 Starting Page 4 final submission...');
            console.log('📊 Current color images state:', colorImages);
            console.log('📊 Current form data:', formData);

            // Upload color images
            console.log('📤 Uploading color images...');
            const uploadedColorImages = await uploadMultipleImages(
                colorImages.map(img => ({ file: img.file, caption: img.caption, previewUrl: img.previewUrl }))
            );
            console.log('✅ Color images uploaded:', uploadedColorImages);

            // Prepare data for submission
            const carData = {
                ...formData,
                colorImages: uploadedColorImages,
                // Ensure all required fields have defaults
                engineSummaries: formData.engineSummaries || [],
                mileageData: formData.mileageData || [],
                faqs: formData.faqs || [],
                galleryImages: formData.galleryImages || [],
                keyFeatureImages: formData.keyFeatureImages || [],
                spaceComfortImages: formData.spaceComfortImages || [],
                storageConvenienceImages: formData.storageConvenienceImages || [],
                heroImage: formData.heroImage || null,
                status: formData.status || 'active'
            };

            console.log('💾 Final upcoming car data being submitted:', carData);

            saveUpcomingCar.mutate(carData as InsertUpcomingCar);
        } catch (error) {
            console.error('❌ Upload error:', error);
            toast({
                title: "Upload failed",
                description: "Failed to upload color images. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="p-8">
            <div className="space-y-8 max-w-6xl">
                <h2 className="text-xl font-semibold">Page 4</h2>

                <div className="space-y-6">
                    <Label className="text-base font-semibold">Colour Images</Label>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {colorImages.map((img, index) => (
                            <div key={img.id} className="space-y-2">
                                <Label>Colour image {index + 1}</Label>
                                <ImageUpload
                                    caption={img.caption}
                                    onCaptionChange={(caption) => {
                                        const updated = [...colorImages];
                                        updated[index].caption = caption;
                                        setColorImages(updated);
                                    }}
                                    onImageChange={(file, previewUrl) => {
                                        const updated = [...colorImages];
                                        updated[index] = { ...updated[index], file: file || undefined, previewUrl };
                                        setColorImages(updated);
                                        console.log('🖼️ Updated color image:', img.id, 'File:', !!file, 'PreviewURL:', previewUrl);
                                    }}
                                    onDelete={() => {
                                        const updatedImages = colorImages.filter(item => item.id !== img.id);
                                        setColorImages(updatedImages);
                                        console.log('🗑️ Deleted color image:', img.id, 'Remaining:', updatedImages.length);
                                    }}
                                    initialImage={img.previewUrl}
                                />
                            </div>
                        ))}

                        <div className="flex items-center justify-center">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    const newImage = { id: `color-${Date.now()}`, caption: '', previewUrl: '', file: undefined };
                                    const updatedImages = [...colorImages, newImage];
                                    setColorImages(updatedImages);
                                    console.log('➕ Added new color image slot:', newImage.id, 'Total:', updatedImages.length);
                                }}
                                data-testid="button-add-color-image"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add more images
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setLocation(isEditMode ? `/upcoming-cars/${carId}/edit/page3` : '/upcoming-cars/new/page3')}
                        data-testid="button-previous-page"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saveUpcomingCar.isPending}
                        data-testid="button-save-all-data"
                    >
                        {saveUpcomingCar.isPending ? 'Saving...' : (isEditMode ? 'Update Upcoming Car' : 'Save All The Data')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
