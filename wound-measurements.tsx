import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFormContext } from "react-hook-form";
import { Calculator } from "lucide-react";

interface WoundMeasurementsProps {
  isDisabled: boolean;
}

export default function WoundMeasurements({ isDisabled }: WoundMeasurementsProps) {
  const { register, watch, setValue, formState: { errors }, clearErrors } = useFormContext();
  
  const length = watch("length") || 0;
  const width = watch("width") || 0;
  const depth = watch("depth") || 0;
  
  // Calculate area when length or width changes
  useEffect(() => {
    const lengthValue = typeof length === 'string' ? parseFloat(length) : length;
    const widthValue = typeof width === 'string' ? parseFloat(width) : width;
    
    if (!isNaN(lengthValue) && !isNaN(widthValue) && lengthValue > 0 && widthValue > 0) {
      const area = lengthValue * widthValue;
      setValue("area", parseFloat(area.toFixed(2))); // Round to 2 decimal places
      
      if (lengthValue > 0) clearErrors("length");
      if (widthValue > 0) clearErrors("width");
    } else {
      setValue("area", 0);
    }
  }, [length, width, setValue, clearErrors]);
  
  // Handle depth validation separately
  useEffect(() => {
    const depthValue = typeof depth === 'string' ? parseFloat(depth) : depth;
    if (!isNaN(depthValue) && depthValue > 0) {
      clearErrors("depth");
    }
  }, [depth, clearErrors]);

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Measurements</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="mb-1 block">
              Length (cm)*
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              disabled={isDisabled}
              {...register("length", { required: true, min: 0.1 })}
            />
            {errors.length && (
              <p className="text-sm text-red-500 mt-1">Length is required</p>
            )}
          </div>
          <div>
            <Label className="mb-1 block">
              Width (cm)*
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              disabled={isDisabled}
              {...register("width", { required: true, min: 0.1 })}
            />
            {errors.width && (
              <p className="text-sm text-red-500 mt-1">Width is required</p>
            )}
          </div>
          <div>
            <Label className="mb-1 block">
              Depth (cm)*
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0.1"
              disabled={isDisabled}
              {...register("depth", { required: true, min: 0.1 })}
            />
            {errors.depth && (
              <p className="text-sm text-red-500 mt-1">Depth is required</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="flex items-center text-gray-700">
            <Calculator className="mr-2 text-primary h-5 w-5" />
            <span className="font-medium">Calculated Area:</span>
            <span className="ml-2 font-bold">{watch("area") || 0} cm²</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <Label className="mb-2 block">
              Undermining
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-xs text-gray-500 mb-1">
                  Size (cm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  disabled={isDisabled}
                  {...register("underminingSize")}
                />
              </div>
              <div>
                <Label className="block text-xs text-gray-500 mb-1">
                  Location (Clock Format)
                </Label>
                <Select 
                  disabled={isDisabled}
                  onValueChange={(value) => setValue("underminingLocation", value)}
                  defaultValue={watch("underminingLocation")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {i + 1} o'clock
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              Tunneling
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="block text-xs text-gray-500 mb-1">
                  Size (cm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  disabled={isDisabled}
                  {...register("tunnelingSize")}
                />
              </div>
              <div>
                <Label className="block text-xs text-gray-500 mb-1">
                  Location (Clock Format)
                </Label>
                <Select 
                  disabled={isDisabled}
                  onValueChange={(value) => setValue("tunnelingLocation", value)}
                  defaultValue={watch("tunnelingLocation")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i} value={String(i + 1)}>
                        {i + 1} o'clock
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
