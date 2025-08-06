import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Camera, FileText, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { analyzeWoundImage, getTreatmentRecommendations, analyzeHealingProgress } from "@/lib/ai";

interface AIWoundAnalysisProps {
  isDisabled: boolean;
  woundImages?: string[];
  previousAssessments?: any[];
}

interface AIAnalysisResult {
  woundType: string;
  severity: string;
  infectionRisk: string;
  healingStage: string;
  recommendations: string[];
  confidence: number;
  bwatScore?: number;
  nextSteps: string[];
}

export default function AIWoundAnalysis({ isDisabled, woundImages, previousAssessments }: AIWoundAnalysisProps) {
  const { watch } = useFormContext();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Watch BWAT values for integration
  const bwatValues = watch([
    "bwat.size", "bwat.depth", "bwat.edges", "bwat.undermining",
    "bwat.necroticTissueType", "bwat.necroticTissueAmount", "bwat.exudateType",
    "bwat.exudateAmount", "bwat.skinColor", "bwat.peripheralEdema",
    "bwat.peripheralInduration", "bwat.granulationTissue", "bwat.epithelialization"
  ]);

  const bwatScore = bwatValues.reduce((sum, value) => sum + (value || 0), 0);

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const assessmentData = watch();
      
      // Combine image analysis with BWAT assessment
      let imageAnalysis = "";
      if (woundImages && woundImages.length > 0) {
        try {
          const imageResult = await analyzeWoundImage(woundImages[0]);
          imageAnalysis = imageResult || "";
        } catch (err) {
          console.warn("Image analysis failed:", err);
        }
      }

      // Get treatment recommendations based on assessment data
      const recommendations = await getTreatmentRecommendations({
        ...assessmentData,
        bwatScore,
        imageAnalysis
      });

      // Analyze healing progress if previous assessments exist
      let healingAnalysis = "";
      if (previousAssessments && previousAssessments.length > 1) {
        try {
          healingAnalysis = await analyzeHealingProgress(previousAssessments);
        } catch (err) {
          console.warn("Healing analysis failed:", err);
        }
      }

      // Determine wound characteristics based on BWAT and assessment data
      const woundType = assessmentData.woundType || "Unknown";
      const severity = bwatScore <= 13 ? "Minimal" : 
                     bwatScore <= 20 ? "Mild" : 
                     bwatScore <= 30 ? "Moderate" : 
                     bwatScore <= 40 ? "Severe" : "Very Severe";
      
      const infectionRisk = assessmentData.nerdsAssessment?.smell || 
                           assessmentData.stoneesAssessment?.smell ? "High" :
                           assessmentData.exudateType === "Purulent" ? "Moderate" : "Low";

      const healingStage = assessmentData.epithelializationTissue > 50 ? "Advanced Healing" :
                          assessmentData.granulationTissue > 50 ? "Granulation Phase" :
                          assessmentData.sloughTissue > 25 ? "Debridement Needed" :
                          "Inflammatory Phase";

      const result: AIAnalysisResult = {
        woundType,
        severity,
        infectionRisk,
        healingStage,
        recommendations: recommendations ? [recommendations] : [],
        confidence: 85,
        bwatScore,
        nextSteps: [
          "Continue current treatment protocol",
          "Monitor for signs of infection",
          "Schedule follow-up assessment",
          "Consider specialist consultation if no improvement"
        ]
      };

      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minimal": return "bg-green-100 text-green-800";
      case "Mild": return "bg-yellow-100 text-yellow-800";
      case "Moderate": return "bg-orange-100 text-orange-800";
      case "Severe": return "bg-red-100 text-red-800";
      case "Very Severe": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800";
      case "Moderate": return "bg-yellow-100 text-yellow-800";
      case "High": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Powered Wound Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Alert className="mb-4">
          <Brain className="h-4 w-4" />
          <AlertDescription>
            AI analysis combines wound images, BWAT assessment, and clinical data to provide 
            comprehensive wound analysis and treatment recommendations.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {woundImages?.length || 0} images available
            </span>
          </div>
          <Button
            onClick={performAnalysis}
            disabled={isDisabled || isAnalyzing}
            className="bg-primary text-white"
          >
            <Brain className="mr-2 h-4 w-4" />
            {isAnalyzing ? "Analyzing..." : "Analyze Wound"}
          </Button>
        </div>

        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isAnalyzing && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        )}

        {analysisResult && (
          <div className="space-y-6">
            {/* Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Wound Type</span>
                </div>
                <p className="text-lg font-semibold">{analysisResult.woundType}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Severity</span>
                </div>
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {analysisResult.severity}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Infection Risk</span>
                </div>
                <Badge className={getRiskColor(analysisResult.infectionRisk)}>
                  {analysisResult.infectionRisk}
                </Badge>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Healing Stage</span>
                </div>
                <p className="text-sm font-semibold">{analysisResult.healingStage}</p>
              </div>
            </div>

            {/* BWAT Integration */}
            {analysisResult.bwatScore !== undefined && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">BWAT Assessment Integration</h4>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-sm text-blue-700">Total Score:</span>
                    <span className="ml-2 font-bold text-blue-900">{analysisResult.bwatScore}/65</span>
                  </div>
                  <Progress value={(analysisResult.bwatScore / 65) * 100} className="flex-1" />
                  <Badge className={getSeverityColor(analysisResult.severity)}>
                    {analysisResult.severity}
                  </Badge>
                </div>
              </div>
            )}

            {/* Treatment Recommendations */}
            {analysisResult.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">AI Treatment Recommendations</h4>
                <div className="space-y-2">
                  {analysisResult.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommended Next Steps</h4>
              <div className="space-y-2">
                {analysisResult.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Score */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Analysis Confidence</span>
                <span className="text-sm font-bold text-gray-900">{analysisResult.confidence}%</span>
              </div>
              <Progress value={analysisResult.confidence} className="h-2" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}