import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

interface WoundBedProps {
  isDisabled: boolean;
}

export default function WoundBed({ isDisabled }: WoundBedProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  const necroticTissue = parseFloat(watch("necroticTissue") || 0);
  const sloughTissue = parseFloat(watch("sloughTissue") || 0);
  const granulationTissue = parseFloat(watch("granulationTissue") || 0);
  const epithelializationTissue = parseFloat(watch("epithelializationTissue") || 0);
  
  // Calculate total tissue percentage
  const totalTissue = necroticTissue + sloughTissue + granulationTissue + epithelializationTissue;
  
  // Check if total is equal to 100
  const isValidTotal = totalTissue === 100;

  // Helper function to register checkbox with formContext
  const registerCheckbox = (name: string) => {
    return {
      checked: watch(`woundEdge.${name}`) || false,
      onCheckedChange: (checked: boolean) => {
        setValue(`woundEdge.${name}`, checked);
      },
    };
  };

  const registerPeriWoundCheckbox = (name: string) => {
    return {
      checked: watch(`periWound.${name}`) || false,
      onCheckedChange: (checked: boolean) => {
        setValue(`periWound.${name}`, checked);
      },
    };
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Bed Assessment</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Tissue Types (total should equal 100%)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                Necrotic (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                disabled={isDisabled}
                {...register("necroticTissue")}
              />
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                Slough (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                disabled={isDisabled}
                {...register("sloughTissue")}
              />
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                Granulation (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                disabled={isDisabled}
                {...register("granulationTissue")}
              />
            </div>
            <div>
              <Label className="block text-xs text-gray-500 mb-1">
                Epithelialization (%)
              </Label>
              <Input
                type="number"
                min="0"
                max="100"
                disabled={isDisabled}
                {...register("epithelializationTissue")}
              />
            </div>
          </div>
          <div className={`mt-2 text-sm ${isValidTotal ? 'text-gray-500' : 'text-red-500'}`}>
            Total: <span className="font-medium">{totalTissue}%</span>
            {!isValidTotal && <span className="ml-2">(Should equal 100%)</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Wound Edge Assessment
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="edge_attached" 
                  disabled={isDisabled}
                  {...registerCheckbox("attached")}
                />
                <Label htmlFor="edge_attached" className="ml-2 block text-sm text-gray-700">
                  Attached
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="edge_undermining"
                  disabled={isDisabled}
                  {...registerCheckbox("undermining")}
                />
                <Label htmlFor="edge_undermining" className="ml-2 block text-sm text-gray-700">
                  Undermining
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="edge_macerated"
                  disabled={isDisabled}
                  {...registerCheckbox("macerated")}
                />
                <Label htmlFor="edge_macerated" className="ml-2 block text-sm text-gray-700">
                  Macerated
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="edge_rolled"
                  disabled={isDisabled}
                  {...registerCheckbox("rolled")}
                />
                <Label htmlFor="edge_rolled" className="ml-2 block text-sm text-gray-700">
                  Rolled
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Peri-wound Assessment
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="peri_maceration"
                  disabled={isDisabled}
                  {...registerPeriWoundCheckbox("maceration")}
                />
                <Label htmlFor="peri_maceration" className="ml-2 block text-sm text-gray-700">
                  Maceration
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="peri_healthy"
                  disabled={isDisabled}
                  {...registerPeriWoundCheckbox("healthy")}
                />
                <Label htmlFor="peri_healthy" className="ml-2 block text-sm text-gray-700">
                  Healthy
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="peri_cellulitis"
                  disabled={isDisabled}
                  {...registerPeriWoundCheckbox("cellulitis")}
                />
                <Label htmlFor="peri_cellulitis" className="ml-2 block text-sm text-gray-700">
                  Cellulitis
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="peri_rash"
                  disabled={isDisabled}
                  {...registerPeriWoundCheckbox("rash")}
                />
                <Label htmlFor="peri_rash" className="ml-2 block text-sm text-gray-700">
                  Rash
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
