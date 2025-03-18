import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface WoundClassificationProps {
  isDisabled: boolean;
}

export default function WoundClassification({ isDisabled }: WoundClassificationProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  const woundType = watch("woundType");
  
  // Update stage options based on wound type
  useEffect(() => {
    // Clear the stage when wound type changes
    setValue("woundStage", "");
  }, [woundType, setValue]);

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Classification</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="woundType" className="mb-2 block">
              Wound Type*
            </Label>
            <Select 
              disabled={isDisabled}
              onValueChange={(value) => setValue("woundType", value)}
              defaultValue={watch("woundType")}
            >
              <SelectTrigger id="woundType" className="w-full">
                <SelectValue placeholder="Select wound type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pressure_injury">Pressure Injury</SelectItem>
                <SelectItem value="diabetic_foot">Diabetic Foot</SelectItem>
                <SelectItem value="skin_tear">Skin Tear</SelectItem>
                <SelectItem value="burn">Burn</SelectItem>
                <SelectItem value="surgical_wound">Surgical Wound</SelectItem>
                <SelectItem value="infected_wound">Infected Wound</SelectItem>
                <SelectItem value="atypical_wound">Atypical Wound</SelectItem>
              </SelectContent>
            </Select>
            {errors.woundType && (
              <p className="text-sm text-red-500 mt-1">Wound type is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="woundStage" className="mb-2 block">
              Category/Stage*
            </Label>
            <Select 
              disabled={isDisabled || !woundType}
              onValueChange={(value) => setValue("woundStage", value)}
              defaultValue={watch("woundStage")}
            >
              <SelectTrigger id="woundStage" className="w-full">
                <SelectValue placeholder="Select category/stage" />
              </SelectTrigger>
              <SelectContent>
                {woundType === "pressure_injury" && (
                  <>
                    <SelectItem value="stage1">Stage 1</SelectItem>
                    <SelectItem value="stage2">Stage 2</SelectItem>
                    <SelectItem value="stage3">Stage 3</SelectItem>
                    <SelectItem value="stage4">Stage 4</SelectItem>
                    <SelectItem value="unstageable">Unstageable</SelectItem>
                    <SelectItem value="deep_tissue_injury">Deep Tissue Injury</SelectItem>
                  </>
                )}
                {woundType === "diabetic_foot" && (
                  <>
                    <SelectItem value="wagner1">Wagner Grade 1</SelectItem>
                    <SelectItem value="wagner2">Wagner Grade 2</SelectItem>
                    <SelectItem value="wagner3">Wagner Grade 3</SelectItem>
                    <SelectItem value="wagner4">Wagner Grade 4</SelectItem>
                    <SelectItem value="wagner5">Wagner Grade 5</SelectItem>
                  </>
                )}
                {woundType === "skin_tear" && (
                  <>
                    <SelectItem value="type1">Type 1</SelectItem>
                    <SelectItem value="type2">Type 2</SelectItem>
                    <SelectItem value="type3">Type 3</SelectItem>
                  </>
                )}
                {woundType === "burn" && (
                  <>
                    <SelectItem value="first_degree">First Degree</SelectItem>
                    <SelectItem value="second_degree">Second Degree</SelectItem>
                    <SelectItem value="third_degree">Third Degree</SelectItem>
                    <SelectItem value="fourth_degree">Fourth Degree</SelectItem>
                  </>
                )}
                {(woundType === "surgical_wound" || woundType === "infected_wound" || woundType === "atypical_wound") && (
                  <>
                    <SelectItem value="superficial">Superficial</SelectItem>
                    <SelectItem value="partial_thickness">Partial Thickness</SelectItem>
                    <SelectItem value="full_thickness">Full Thickness</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.woundStage && (
              <p className="text-sm text-red-500 mt-1">Category/Stage is required</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">
              Wound Location*
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Select 
                disabled={isDisabled}
                onValueChange={(value) => setValue("woundLocation", value)}
                defaultValue={watch("woundLocation")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select primary location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sacrum">Sacrum</SelectItem>
                  <SelectItem value="coccyx">Coccyx</SelectItem>
                  <SelectItem value="ischium">Ischium</SelectItem>
                  <SelectItem value="trochanter">Trochanter</SelectItem>
                  <SelectItem value="heel">Heel</SelectItem>
                  <SelectItem value="foot">Foot</SelectItem>
                  <SelectItem value="ankle">Ankle</SelectItem>
                  <SelectItem value="leg">Leg</SelectItem>
                  <SelectItem value="abdomen">Abdomen</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                disabled={isDisabled}
                onValueChange={(value) => setValue("woundSide", value)}
                defaultValue={watch("woundSide")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select side (if applicable)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="bilateral">Bilateral</SelectItem>
                  <SelectItem value="na">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.woundLocation && (
              <p className="text-sm text-red-500 mt-1">Wound location is required</p>
            )}
          </div>

          <div>
            <Label className="mb-2 block">
              Date of Wound Onset
            </Label>
            <Input
              type="date"
              disabled={isDisabled}
              {...register("woundOnsetDate")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
