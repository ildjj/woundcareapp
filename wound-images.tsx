import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { WoundImage } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";

interface WoundImagesProps {
  isDisabled: boolean;
}

export default function WoundImages({ isDisabled }: WoundImagesProps) {
  const { register, watch, setValue } = useFormContext();
  const [tempImages, setTempImages] = useState<{ file: File; preview: string; description: string }[]>([]);
  
  // Watch for any existing wound images
  const woundImages = watch("woundImages") || [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const newImage = {
          file: file,
          preview: reader.result as string,
          description: ""
        };
        
        setTempImages([...tempImages, newImage]);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const updatedImages = [...tempImages];
    updatedImages.splice(index, 1);
    setTempImages(updatedImages);
  };
  
  const handleDescriptionChange = (index: number, description: string) => {
    const updatedImages = [...tempImages];
    updatedImages[index].description = description;
    setTempImages(updatedImages);
    
    // Also update the form data
    updateFormImages();
  };
  
  const updateFormImages = () => {
    const formattedImages: WoundImage[] = tempImages.map(img => ({
      url: img.preview,
      dateUploaded: new Date(),
      description: img.description
    }));
    
    setValue("woundImages", formattedImages);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold">Wound Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upload button */}
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="woundImage">Upload Wound Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="woundImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isDisabled}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                disabled={isDisabled}
                onClick={() => document.getElementById("woundImage")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                disabled={true} // Disabled for future implementation
              >
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
            </div>
          </div>
          
          {/* Image preview */}
          {tempImages.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Uploaded Images ({tempImages.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tempImages.map((image, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Image {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        disabled={isDisabled}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="aspect-video relative mb-2 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <img 
                        src={image.preview} 
                        alt={`Wound image ${index + 1}`} 
                        className="object-contain max-h-full z-10" 
                      />
                    </div>
                    <Textarea
                      placeholder="Add description..."
                      value={image.description}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      disabled={isDisabled}
                      className="h-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No images message */}
          {tempImages.length === 0 && (
            <div className="text-center py-6 border rounded-lg">
              <ImageIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No images uploaded yet</p>
              <p className="text-gray-400 text-sm">Upload images to document the wound condition</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}