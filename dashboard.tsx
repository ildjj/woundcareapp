import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import MobileMenu from "@/components/layout/mobile-menu";
import SummaryCard from "@/components/dashboard/summary-card";
import RecentAssessments from "@/components/dashboard/recent-assessments";
import WoundTypeDistribution from "@/components/dashboard/wound-chart";
import UpcomingFollowups from "@/components/dashboard/upcoming-followups";
import { ClipboardList, Scale, AlertTriangle, Clock } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface DashboardSummary {
  activeAssessments: number;
  criticalCases: number;
  healingProgress: number;
  followUpsToday: number;
}

export default function Dashboard() {
  const { data: summaryData, isLoading } = useQuery<DashboardSummary>({
    queryKey: ["/api/dashboard/summary"],
  });

  // Default values if data is not loaded yet
  const {
    activeAssessments = 0,
    criticalCases = 0,
    healingProgress = 0,
    followUpsToday = 0
  } = summaryData || {};

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <MobileMenu />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100 pt-0 md:pt-6">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
              <Link href="/assessment">
                <Button className="bg-primary text-white">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  New Assessment
                </Button>
              </Link>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard 
                title="Active Assessments" 
                value={activeAssessments} 
                icon={<ClipboardList className="h-5 w-5" />} 
                color="blue" 
              />
              <SummaryCard 
                title="Healing Progress" 
                value={`${healingProgress}%`} 
                icon={<Scale className="h-5 w-5" />} 
                color="green" 
              />
              <SummaryCard 
                title="Critical Cases" 
                value={criticalCases} 
                icon={<AlertTriangle className="h-5 w-5" />} 
                color="red" 
              />
              <SummaryCard 
                title="Follow-ups Today" 
                value={followUpsToday} 
                icon={<Clock className="h-5 w-5" />} 
                color="purple" 
              />
            </div>

            {/* Recent Assessments */}
            <RecentAssessments />

            {/* Analytics & Upcoming Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <WoundTypeDistribution isLoading={isLoading} />
              </div>
              
              <div>
                <UpcomingFollowups isLoading={isLoading} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
