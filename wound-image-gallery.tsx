
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import type { WoundImage } from '@/shared/schema';

interface ImageGalleryProps {
  images: WoundImage[];
  onCompare?: (image1: WoundImage, image2: WoundImage) => void;
}

export function WoundImageGallery({ images, onCompare }: ImageGalleryProps) {
  const [selectedImages, setSelectedImages] = useState<WoundImage[]>([]);

  const toggleImageSelection = (image: WoundImage) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter(i => i !== image));
    } else if (selectedImages.length < 2) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Images</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div 
              key={index} 
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                selectedImages.includes(image) ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => toggleImageSelection(image)}
            >
              <img 
                src={image.url} 
                alt={image.description || `Wound image ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                {format(new Date(image.dateUploaded), 'MMM d, yyyy')}
              </div>
            </div>
          ))}
        </div>
        
        {onCompare && selectedImages.length === 2 && (
          <Button 
            onClick={() => onCompare(selectedImages[0], selectedImages[1])}
            className="mt-4"
          >
            Compare Selected Images
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
