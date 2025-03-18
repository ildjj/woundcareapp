
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WoundImage } from '@/shared/schema';
import { format } from 'date-fns';

interface ImageComparisonProps {
  image1: WoundImage;
  image2: WoundImage;
}

export function ImageComparison({ image1, image2 }: ImageComparisonProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Image Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img 
              src={image1.url} 
              alt={image1.description || 'First wound image'} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-center mt-2">
              {format(new Date(image1.dateUploaded), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <img 
              src={image2.url} 
              alt={image2.description || 'Second wound image'} 
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-center mt-2">
              {format(new Date(image2.dateUploaded), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
