
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp } from "lucide-react";

interface HealingAnalysisProps {
  assessments: any[];
}

export function HealingAnalysis({ assessments }: HealingAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const analyzeHealing = async () => {
    if (assessments.length < 2) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/analyze-healing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assessments }),
      });
      
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Failed to analyze healing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (assessments.length < 2) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">AI Healing Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Button 
          onClick={analyzeHealing} 
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Healing Progress...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Analyze Healing Progress
            </>
          )}
        </Button>
        
        {analysis && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
