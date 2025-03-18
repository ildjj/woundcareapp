import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WoundAssessment } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowRight, Eye, Edit } from "lucide-react";
import { Link } from "wouter";

interface RecentAssessmentWithPatient extends WoundAssessment {
  patientName: string;
  patientMRN: string;
}

export default function RecentAssessments() {
  const { data, isLoading, error } = useQuery<RecentAssessmentWithPatient[]>({
    queryKey: ["/api/wound-assessments/recent"],
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'improving':
        return 'bg-green-100 text-green-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'stable':
        return 'bg-blue-100 text-blue-800';
      case 'needs attention':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentAssessments = data || [];

  return (
    <Card className="mb-6">
      <CardHeader className="border-b p-4 flex-row flex justify-between items-center">
        <CardTitle className="text-lg font-bold">Recent Assessments</CardTitle>
        <Link href="/assessment">
          <Button variant="ghost" className="text-primary flex items-center text-sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MRN</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wound Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Assessment</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                    Loading recent assessments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-red-500">
                    Error loading assessments
                  </td>
                </tr>
              ) : recentAssessments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                    No assessments found
                  </td>
                </tr>
              ) : (
                recentAssessments.map((assessment, index) => {
                  // For demonstration, determine status from wound data
                  let status = "Stable";
                  if (assessment.granulationTissue > 50) status = "Improving";
                  if (assessment.stoneesAssessment.osExposed) status = "Critical";
                  if (assessment.stoneesAssessment.erythemaEdema) status = "Needs Attention";

                  return (
                    <tr key={assessment.id || index}>
                      <td className="py-3 px-4">{assessment.patientName}</td>
                      <td className="py-3 px-4">{assessment.patientMRN}</td>
                      <td className="py-3 px-4">{assessment.woundType}</td>
                      <td className="py-3 px-4">
                        {assessment.assessmentDate 
                          ? format(new Date(assessment.assessmentDate), 'dd MMM yyyy')
                          : 'N/A'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary-dark mr-2">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-primary hover:text-primary-dark">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
