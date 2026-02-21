import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { InsertModel } from "@shared/schema";

interface ModelFormContextType {
  formData: Partial<InsertModel>;
  updateFormData: (data: Partial<InsertModel>) => void;
  resetFormData: () => void;
  saveProgress: (data: Partial<InsertModel>) => Promise<string>;
  isEditMode: boolean;
  setEditMode: (editMode: boolean, modelId?: string) => void;
  currentModelId: string | null;
}

const ModelFormContext = createContext<ModelFormContextType | undefined>(undefined);

const initialFormData: Partial<InsertModel> = {
  brandId: '',
  name: '',
  isPopular: false,
  isNew: false,
  popularRank: null,
  newRank: null,
  topRank: null,
  bodyType: null,
  subBodyType: null,
  launchDate: null,
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

export function ModelFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<Partial<InsertModel>>(initialFormData);
  const [isEditMode, setIsEditModeState] = useState(false);
  const [currentModelId, setCurrentModelId] = useState<string | null>(null);
  const { toast } = useToast();

  const updateFormData = (data: Partial<InsertModel>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetFormData = () => {
    setFormData(initialFormData);
    setIsEditModeState(false);
    setCurrentModelId(null);
  };

  const setEditMode = (editMode: boolean, modelId?: string) => {
    setIsEditModeState(editMode);
    setCurrentModelId(modelId || null);
  };

  // Progressive save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<InsertModel>) => {
      const url = isEditMode && currentModelId
        ? `/api/models/${currentModelId}`
        : '/api/models';

      const method = isEditMode && currentModelId ? 'PUT' : 'POST';

      console.log(`🔄 Model Form: ${method} ${url}`, data);

      return await apiRequest(method, url, data);
    },
    onSuccess: (result) => {
      // Update the current model ID if we just created a new model
      if (!isEditMode && result.id) {
        setCurrentModelId(result.id);
        setIsEditModeState(true);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/models'] });

      toast({
        title: "Progress Saved",
        description: `Model ${isEditMode ? 'updated' : 'created'} successfully.`,
      });
    },
    onError: (error: Error) => {
      console.error('Model save error:', error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const saveProgress = async (data: Partial<InsertModel>): Promise<string> => {
    // Update local form data
    updateFormData(data);

    // Save to backend
    const result = await saveMutation.mutateAsync(data);

    // Return the model ID (either existing or newly created)
    return currentModelId || result.id;
  };

  return (
    <ModelFormContext.Provider value={{
      formData,
      updateFormData,
      resetFormData,
      saveProgress,
      isEditMode,
      setEditMode,
      currentModelId
    }}>
      {children}
    </ModelFormContext.Provider>
  );
}

export function useModelForm() {
  const context = useContext(ModelFormContext);
  if (!context) {
    throw new Error("useModelForm must be used within ModelFormProvider");
  }
  return context;
}
