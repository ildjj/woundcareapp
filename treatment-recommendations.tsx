
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function TreatmentRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const { getValues } = useFormContext();

  const getRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/treatment-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(getValues()),
      });
      
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">AI Treatment Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Button 
          onClick={getRecommendations} 
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Recommendations...
            </>
          ) : (
            'Get Treatment Recommendations'
          )}
        </Button>
        
        {recommendations && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{recommendations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
