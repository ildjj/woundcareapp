import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreatmentProps {
  isDisabled: boolean;
}

export default function Treatment({ isDisabled }: TreatmentProps) {
  const { register, watch, setValue } = useFormContext();
  
  const [npwtRequired, setNpwtRequired] = useState(false);
  const [offloadingRequired, setOffloadingRequired] = useState(false);
  const [reviewDate, setReviewDate] = useState<Date | undefined>(
    watch("reviewDate") ? new Date(watch("reviewDate")) : addDays(new Date(), 7)
  );
  
  // Watch the form values to update local state
  useEffect(() => {
    setNpwtRequired(watch("npwtRequired") || false);
    setOffloadingRequired(watch("offloadingRequired") || false);
    
    // Initialize review date if not already set
    if (!watch("reviewDate")) {
      setValue("reviewDate", addDays(new Date(), 7));
      setReviewDate(addDays(new Date(), 7));
    }
  }, [watch, setValue]);

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Treatment Plan</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Dressing Type Selection
            </Label>
            <Select 
              disabled={isDisabled}
              onValueChange={(value) => setValue("dressingType", value)}
              defaultValue={watch("dressingType")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select primary dressing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foam">Foam Dressing</SelectItem>
                <SelectItem value="hydrocolloid">Hydrocolloid</SelectItem>
                <SelectItem value="alginate">Alginate</SelectItem>
                <SelectItem value="hydrofiber">Hydrofiber</SelectItem>
                <SelectItem value="antimicrobial">Antimicrobial</SelectItem>
                <SelectItem value="hydrogel">Hydrogel</SelectItem>
                <SelectItem value="silicone">Silicone</SelectItem>
                <SelectItem value="film">Film</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Secondary Dressing (if applicable)
            </Label>
            <Select 
              disabled={isDisabled}
              onValueChange={(value) => setValue("secondaryDressing", value)}
              defaultValue={watch("secondaryDressing")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select secondary dressing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="foam">Foam Dressing</SelectItem>
                <SelectItem value="compression">Compression Bandage</SelectItem>
                <SelectItem value="gauze">Gauze</SelectItem>
                <SelectItem value="tape">Tape</SelectItem>
                <SelectItem value="film">Film</SelectItem>
                <SelectItem value="pad">ABD Pad</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="block text-sm font-medium text-gray-700">
                Negative Pressure Wound Therapy (NPWT)
              </Label>
              <div className="flex items-center">
                <Checkbox 
                  id="npwt_needed"
                  disabled={isDisabled}
                  checked={npwtRequired}
                  onCheckedChange={(checked) => {
                    setValue("npwtRequired", checked === true);
                    setNpwtRequired(checked === true);
                  }}
                />
                <Label htmlFor="npwt_needed" className="ml-2 block text-sm text-gray-700">
                  NPWT Required
                </Label>
              </div>
            </div>
            
            {npwtRequired && (
              <div className="mt-3 p-4 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Pressure Setting (mmHg)
                    </Label>
                    <Select 
                      disabled={isDisabled}
                      onValueChange={(value) => setValue("npwtSettings.pressure", value)}
                      defaultValue={watch("npwtSettings.pressure") || "125"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pressure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="75">75 mmHg</SelectItem>
                        <SelectItem value="100">100 mmHg</SelectItem>
                        <SelectItem value="125">125 mmHg</SelectItem>
                        <SelectItem value="150">150 mmHg</SelectItem>
                        <SelectItem value="175">175 mmHg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Therapy Mode
                    </Label>
                    <Select 
                      disabled={isDisabled}
                      onValueChange={(value) => setValue("npwtSettings.therapyMode", value)}
                      defaultValue={watch("npwtSettings.therapyMode") || "continuous"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continuous">Continuous</SelectItem>
                        <SelectItem value="intermittent">Intermittent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Foam Type
                    </Label>
                    <Select 
                      disabled={isDisabled}
                      onValueChange={(value) => setValue("npwtSettings.foamType", value)}
                      defaultValue={watch("npwtSettings.foamType") || "black"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select foam type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="black">Black Foam</SelectItem>
                        <SelectItem value="white">White Foam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <Label className="block text-sm font-medium text-gray-700">
                Offloading Required
              </Label>
              <div className="flex items-center">
                <Checkbox 
                  id="offloading_needed"
                  disabled={isDisabled}
                  checked={offloadingRequired}
                  onCheckedChange={(checked) => {
                    setValue("offloadingRequired", checked === true);
                    setOffloadingRequired(checked === true);
                  }}
                />
                <Label htmlFor="offloading_needed" className="ml-2 block text-sm text-gray-700">
                  Yes
                </Label>
              </div>
            </div>
            
            {offloadingRequired && (
              <div className="mt-3 p-4 border border-gray-200 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Offloading Method
                    </Label>
                    <Select 
                      disabled={isDisabled}
                      onValueChange={(value) => setValue("offloadingMethod.method", value)}
                      defaultValue={watch("offloadingMethod.method")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cushion">Cushion</SelectItem>
                        <SelectItem value="boot">Offloading Boot</SelectItem>
                        <SelectItem value="shoe">Specialized Shoes</SelectItem>
                        <SelectItem value="wedge">Heel Wedge</SelectItem>
                        <SelectItem value="mattress">Specialized Mattress</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-xs text-gray-500 mb-1">
                      Notes
                    </Label>
                    <Input
                      type="text"
                      disabled={isDisabled}
                      placeholder="Additional offloading instructions"
                      {...register("offloadingMethod.notes")}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Review Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !reviewDate ? "text-muted-foreground" : ""
                  }`}
                  disabled={isDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {reviewDate ? format(reviewDate, "PPP") : <span>Schedule follow-up</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reviewDate}
                  onSelect={(date) => {
                    setReviewDate(date);
                    setValue("reviewDate", date);
                  }}
                  disabled={isDisabled}
                  fromDate={new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground mt-1">
              Select when this wound should be reassessed
            </p>
          </div>
          
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Treatment Notes
            </Label>
            <Textarea
              disabled={isDisabled}
              rows={3}
              placeholder="Enter any additional instructions, observations or treatment notes"
              {...register("additionalNotes")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
