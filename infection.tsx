import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

interface InfectionProps {
  isDisabled: boolean;
}

export default function Infection({ isDisabled }: InfectionProps) {
  const { watch, setValue } = useFormContext();

  // Helper function for NERDS checkboxes
  const registerNerdsCheckbox = (name: string) => {
    return {
      checked: watch(`nerdsAssessment.${name}`) || false,
      onCheckedChange: (checked: boolean) => {
        setValue(`nerdsAssessment.${name}`, checked);
      },
    };
  };

  // Helper function for STONEES checkboxes
  const registerStoneesCheckbox = (name: string) => {
    return {
      checked: watch(`stoneesAssessment.${name}`) || false,
      onCheckedChange: (checked: boolean) => {
        setValue(`stoneesAssessment.${name}`, checked);
      },
    };
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Infection Assessment</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              NERDS Criteria (Surface Infection)
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="nerds_n"
                  disabled={isDisabled}
                  {...registerNerdsCheckbox("nonHealing")}
                />
                <Label htmlFor="nerds_n" className="ml-2 block text-sm text-gray-700">
                  Non-healing wound
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="nerds_e"
                  disabled={isDisabled}
                  {...registerNerdsCheckbox("exudateIncreased")}
                />
                <Label htmlFor="nerds_e" className="ml-2 block text-sm text-gray-700">
                  Exudate increased
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="nerds_r"
                  disabled={isDisabled}
                  {...registerNerdsCheckbox("redBleeding")}
                />
                <Label htmlFor="nerds_r" className="ml-2 block text-sm text-gray-700">
                  Red and bleeding wound surface
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="nerds_d"
                  disabled={isDisabled}
                  {...registerNerdsCheckbox("debris")}
                />
                <Label htmlFor="nerds_d" className="ml-2 block text-sm text-gray-700">
                  Debris (slough) in wound
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="nerds_s"
                  disabled={isDisabled}
                  {...registerNerdsCheckbox("smell")}
                />
                <Label htmlFor="nerds_s" className="ml-2 block text-sm text-gray-700">
                  Smell or unpleasant odor
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              STONEES Criteria (Deep Infection)
            </Label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_s"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("sizeIncreasing")}
                />
                <Label htmlFor="stonees_s" className="ml-2 block text-sm text-gray-700">
                  Size increasing
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_t"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("temperatureIncreased")}
                />
                <Label htmlFor="stonees_t" className="ml-2 block text-sm text-gray-700">
                  Temperature increased
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_o"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("osExposed")}
                />
                <Label htmlFor="stonees_o" className="ml-2 block text-sm text-gray-700">
                  Os (bone) exposed
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_n"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("newAreas")}
                />
                <Label htmlFor="stonees_n" className="ml-2 block text-sm text-gray-700">
                  New or satellite areas
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_e"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("exudateIncreasing")}
                />
                <Label htmlFor="stonees_e" className="ml-2 block text-sm text-gray-700">
                  Exudate increasing
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_e2"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("erythemaEdema")}
                />
                <Label htmlFor="stonees_e2" className="ml-2 block text-sm text-gray-700">
                  Erythema/Edema
                </Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stonees_s2"
                  disabled={isDisabled}
                  {...registerStoneesCheckbox("smell")}
                />
                <Label htmlFor="stonees_s2" className="ml-2 block text-sm text-gray-700">
                  Smell
                </Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
