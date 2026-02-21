import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import FAQBuilder from "@/components/FAQBuilder";
import { useLocation, useParams } from "wouter";
import { useUpcomingCarForm } from "@/contexts/UpcomingCarFormContext";
import { useToast } from "@/hooks/use-toast";

interface EngineSummary {
    id: string;
    title: string;
    summary: string;
    transmission: string;
    power: string;
    torque: string;
    speed: string;
}

interface MileageData {
    id: string;
    engineName: string;
    companyClaimed: string;
    cityRealWorld: string;
    highwayRealWorld: string;
}

export default function UpcomingCarFormPage2() {
    const [, setLocation] = useLocation();
    const params = useParams();
    const { formData, updateFormData, saveProgress } = useUpcomingCarForm();
    const { toast } = useToast();

    const isEditMode = !!params.id;
    const carId = params.id;

    const [engineSummaries, setEngineSummaries] = useState<EngineSummary[]>(
        formData.engineSummaries?.map((item, index) => ({ ...item, id: index.toString() })) ||
        [{ id: '1', title: '', summary: '', transmission: '', power: '', torque: '', speed: '' }]
    );

    const [mileageData, setMileageData] = useState<MileageData[]>(
        formData.mileageData?.map((item, index) => ({ ...item, id: index.toString() })) ||
        [{ id: '1', engineName: '', companyClaimed: '', cityRealWorld: '', highwayRealWorld: '' }]
    );

    const [faqs, setFaqs] = useState(
        formData.faqs?.map((item: any, index) => ({
            id: item.id || index.toString(),
            question: item.question || '',
            answer: item.answer || ''
        })) || [{ id: '1', question: '', answer: '' }]
    );

    const addEngineSummary = () => {
        setEngineSummaries([...engineSummaries, {
            id: Date.now().toString(),
            title: '',
            summary: '',
            transmission: '',
            power: '',
            torque: '',
            speed: ''
        }]);
    };

    const addMileageData = () => {
        setMileageData([...mileageData, {
            id: Date.now().toString(),
            engineName: '',
            companyClaimed: '',
            cityRealWorld: '',
            highwayRealWorld: ''
        }]);
    };

    return (
        <div className="p-8">
            <div className="space-y-6 max-w-6xl">
                <h2 className="text-xl font-semibold">Page 2</h2>

                <div className="space-y-6">
                    <Label className="text-base font-semibold">Upcoming Car Engine Summary</Label>

                    {engineSummaries.map((engine, index) => (
                        <div key={engine.id} className="space-y-4 p-6 border rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>{index + 1}.Title Name</Label>
                                    <Input
                                        placeholder="Engine Name"
                                        value={engine.title}
                                        onChange={(e) => {
                                            const updated = [...engineSummaries];
                                            updated[index].title = e.target.value;
                                            setEngineSummaries(updated);
                                        }}
                                        data-testid={`input-engine-title-${index}`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Summary</Label>
                                    <RichTextEditor
                                        value={engine.summary}
                                        onChange={(value) => {
                                            const updated = [...engineSummaries];
                                            updated[index].summary = value;
                                            setEngineSummaries(updated);
                                        }}
                                        placeholder="Enter summary"
                                        minHeight="min-h-24"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-semibold">Spec's</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <select
                                        className="px-3 py-2 border rounded-md"
                                        value={engine.transmission}
                                        onChange={(e) => {
                                            const updated = [...engineSummaries];
                                            updated[index].transmission = e.target.value;
                                            setEngineSummaries(updated);
                                        }}
                                        data-testid={`select-transmission-${index}`}
                                    >
                                        <option value="">Transmission Drop Down</option>
                                        <option value="manual">Manual</option>
                                        <option value="automatic">Automatic</option>
                                        <option value="cvt">CVT</option>
                                        <option value="amt">AMT</option>
                                        <option value="dct">DCT</option>
                                        <option value="imt">iMT</option>
                                    </select>
                                    <Input
                                        placeholder="Power figure text field"
                                        value={engine.power}
                                        onChange={(e) => {
                                            const updated = [...engineSummaries];
                                            updated[index].power = e.target.value;
                                            setEngineSummaries(updated);
                                        }}
                                        data-testid={`input-power-${index}`}
                                    />
                                    <Input
                                        placeholder="Torque figure text field"
                                        value={engine.torque}
                                        onChange={(e) => {
                                            const updated = [...engineSummaries];
                                            updated[index].torque = e.target.value;
                                            setEngineSummaries(updated);
                                        }}
                                        data-testid={`input-torque-${index}`}
                                    />
                                    <Input
                                        placeholder="Transmission speed text field"
                                        value={engine.speed}
                                        onChange={(e) => {
                                            const updated = [...engineSummaries];
                                            updated[index].speed = e.target.value;
                                            setEngineSummaries(updated);
                                        }}
                                        data-testid={`input-speed-${index}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={addEngineSummary}
                        data-testid="button-add-engine-summary"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Engine Summary
                    </Button>
                </div>

                <div className="space-y-6">
                    <Label className="text-base font-semibold">Upcoming Car Mileage</Label>

                    {mileageData.map((mileage, index) => (
                        <div key={mileage.id} className="space-y-4 p-6 border rounded-lg">
                            <div className="space-y-2">
                                <Label>{index + 1}.Engine & Transmission Name</Label>
                                <Input
                                    placeholder="Title"
                                    value={mileage.engineName}
                                    onChange={(e) => {
                                        const updated = [...mileageData];
                                        updated[index].engineName = e.target.value;
                                        setMileageData(updated);
                                    }}
                                    data-testid={`input-mileage-engine-${index}`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Company Claimed</Label>
                                    <Input
                                        placeholder="Text Box"
                                        value={mileage.companyClaimed}
                                        onChange={(e) => {
                                            const updated = [...mileageData];
                                            updated[index].companyClaimed = e.target.value;
                                            setMileageData(updated);
                                        }}
                                        data-testid={`input-company-claimed-${index}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>City Real World</Label>
                                    <Input
                                        placeholder="Text Box"
                                        value={mileage.cityRealWorld}
                                        onChange={(e) => {
                                            const updated = [...mileageData];
                                            updated[index].cityRealWorld = e.target.value;
                                            setMileageData(updated);
                                        }}
                                        data-testid={`input-city-mileage-${index}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Highway Real World</Label>
                                    <Input
                                        placeholder="Text Box"
                                        value={mileage.highwayRealWorld}
                                        onChange={(e) => {
                                            const updated = [...mileageData];
                                            updated[index].highwayRealWorld = e.target.value;
                                            setMileageData(updated);
                                        }}
                                        data-testid={`input-highway-mileage-${index}`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={addMileageData}
                        data-testid="button-add-mileage"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Mileage
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label className="text-base font-semibold">Upcoming Car FAQ</Label>
                    <FAQBuilder
                        items={faqs}
                        onChange={(items) => {
                            console.log('FAQ data changed:', items);
                            setFaqs(items);
                        }}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setLocation(isEditMode ? `/upcoming-cars/${carId}/edit` : '/upcoming-cars/new')}
                        data-testid="button-previous-page"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                    </Button>
                    <Button
                        onClick={async () => {
                            try {
                                // Prepare data for saving (remove id fields for schema)
                                const formDataUpdate = {
                                    engineSummaries: engineSummaries.map(({ id, ...rest }) => rest),
                                    mileageData: mileageData.map(({ id, ...rest }) => rest),
                                    faqs: faqs.map(({ id, ...rest }) => ({ ...rest, question: rest.question || '', answer: rest.answer || '' }))
                                };

                                console.log('💾 Saving Page 2 progress:', formDataUpdate);

                                // Save progress to backend
                                const savedCarId = await saveProgress(formDataUpdate);
                                console.log('✅ Upcoming car saved with ID:', savedCarId);

                                toast({
                                    title: "Progress Saved",
                                    description: "Engine summaries, mileage data, and FAQs saved successfully.",
                                });

                                // Navigate to next page
                                setLocation(`/upcoming-cars/${savedCarId}/edit/page3`);
                            } catch (error) {
                                console.error('❌ Save error:', error);
                                toast({
                                    title: "Save Failed",
                                    description: "Failed to save progress. Please try again.",
                                    variant: "destructive",
                                });
                            }
                        }}
                        data-testid="button-next-page"
                    >
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
