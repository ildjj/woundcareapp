import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useFormContext } from "react-hook-form";

interface ExudatePainProps {
  isDisabled: boolean;
}

export default function ExudatePain({ isDisabled }: ExudatePainProps) {
  const { watch, setValue } = useFormContext();
  
  const painScale = watch("painScale") || 0;

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Exudate & Pain Assessment</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Exudate Level
            </Label>
            <Select 
              disabled={isDisabled}
              onValueChange={(value) => setValue("exudateLevel", value)}
              defaultValue={watch("exudateLevel")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exudate level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Exudate Type
            </Label>
            <Select 
              disabled={isDisabled}
              onValueChange={(value) => setValue("exudateType", value)}
              defaultValue={watch("exudateType")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select exudate type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="serous">Serous</SelectItem>
                <SelectItem value="sanguineous">Sanguineous</SelectItem>
                <SelectItem value="serosanguineous">Serosanguineous</SelectItem>
                <SelectItem value="purulent">Purulent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Scale (0-10)
            </Label>
            <div className="flex items-center gap-4">
              <Slider
                className="flex-1"
                disabled={isDisabled}
                min={0}
                max={10}
                step={1}
                value={[painScale]}
                onValueChange={(value) => setValue("painScale", value[0])}
              />
              <div className="w-8 text-center font-medium">{painScale}</div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No Pain (0)</span>
              <span>Moderate (5)</span>
              <span>Worst Pain (10)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
