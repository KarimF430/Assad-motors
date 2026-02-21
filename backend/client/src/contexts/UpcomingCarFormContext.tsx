import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertUpcomingCar } from "@shared/schema";

interface UpcomingCarFormContextType {
    formData: Partial<InsertUpcomingCar>;
    updateFormData: (data: Partial<InsertUpcomingCar>) => void;
    resetFormData: () => void;
    saveProgress: (data: Partial<InsertUpcomingCar>) => Promise<string>;
    isEditMode: boolean;
    setEditMode: (editMode: boolean, carId?: string) => void;
    currentCarId: string | null;
}

const UpcomingCarFormContext = createContext<UpcomingCarFormContextType | undefined>(undefined);

const initialFormData: Partial<InsertUpcomingCar> = {
    brandId: '',
    name: '',
    isPopular: false,
    isNew: false,
    popularRank: null,
    newRank: null,
    bodyType: null,
    subBodyType: null,
    expectedLaunchDate: null,
    expectedPriceMin: null,
    expectedPriceMax: null,
    fuelTypes: [],
    transmissions: [],
    brochureUrl: null,
    status: 'active',
    headerSeo: null,
    pros: null,
    cons: null,
    description: null,
    exteriorDesign: null,
    comfortConvenience: null,
    engineSummaries: [],
    mileageData: [],
    faqs: [],
    heroImage: null,
    galleryImages: [],
    keyFeatureImages: [],
    spaceComfortImages: [],
    storageConvenienceImages: [],
    colorImages: [],
};

export function UpcomingCarFormProvider({ children }: { children: ReactNode }) {
    const [formData, setFormData] = useState<Partial<InsertUpcomingCar>>(initialFormData);
    const [isEditMode, setIsEditModeState] = useState(false);
    const [currentCarId, setCurrentCarId] = useState<string | null>(null);
    const { toast } = useToast();

    const updateFormData = (data: Partial<InsertUpcomingCar>) => {
        setFormData((prev: Partial<InsertUpcomingCar>) => ({ ...prev, ...data }));
    };

    const resetFormData = () => {
        setFormData(initialFormData);
        setIsEditModeState(false);
        setCurrentCarId(null);
    };

    const setEditMode = (editMode: boolean, carId?: string) => {
        setIsEditModeState(editMode);
        setCurrentCarId(carId || null);
    };

    // Progressive save mutation
    const saveMutation = useMutation({
        mutationFn: async (data: Partial<InsertUpcomingCar>) => {
            const url = isEditMode && currentCarId
                ? `/api/upcoming-cars/${currentCarId}`
                : '/api/upcoming-cars';

            const method = isEditMode && currentCarId ? 'PUT' : 'POST';

            console.log(`🔄 Upcoming Car Form: ${method} ${url}`, data);

            return await apiRequest(method, url, data);
        },
        onSuccess: (result) => {
            // Update the current car ID if we just created a new car
            if (!isEditMode && result.id) {
                setCurrentCarId(result.id);
                setIsEditModeState(true);
            }

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['/api/upcoming-cars'] });

            toast({
                title: "Progress Saved",
                description: `Upcoming car ${isEditMode ? 'updated' : 'created'} successfully.`,
            });
        },
        onError: (error: Error) => {
            console.error('Upcoming car save error:', error);
            toast({
                title: "Save Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const saveProgress = async (data: Partial<InsertUpcomingCar>): Promise<string> => {
        // Update local form data
        updateFormData(data);

        // Save to backend
        const result = await saveMutation.mutateAsync(data);

        // Return the car ID (either existing or newly created)
        return currentCarId || result.id;
    };

    return (
        <UpcomingCarFormContext.Provider value={{
            formData,
            updateFormData,
            resetFormData,
            saveProgress,
            isEditMode,
            setEditMode,
            currentCarId
        }}>
            {children}
        </UpcomingCarFormContext.Provider>
    );
}

export function useUpcomingCarForm() {
    const context = useContext(UpcomingCarFormContext);
    if (!context) {
        throw new Error("useUpcomingCarForm must be used within UpcomingCarFormProvider");
    }
    return context;
}
