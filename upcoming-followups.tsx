import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FollowUp {
  id: number;
  patientName: string;
  patientMRN: string;
  date: Date;
  time: string;
}

interface UpcomingFollowupsProps {
  followUps?: FollowUp[];
  isLoading?: boolean;
}

export default function UpcomingFollowups({ 
  followUps,
  isLoading = false
}: UpcomingFollowupsProps) {
  // Sample data if none provided
  const defaultFollowUps: FollowUp[] = [
    { id: 1, patientName: "Ahmad Al-Farsi", patientMRN: "MRN-5632147", date: new Date(), time: "10:30 AM" },
    { id: 2, patientName: "Fatima Mohammad", patientMRN: "MRN-7825401", date: new Date(), time: "11:45 AM" },
    { id: 3, patientName: "Yusuf Al-Qasimi", patientMRN: "MRN-9012456", date: new Date(), time: "2:00 PM" },
    { id: 4, patientName: "Mohammed Abdullah", patientMRN: "MRN-4520178", date: new Date(Date.now() + 86400000), time: "9:15 AM" },
  ];

  const displayFollowUps = followUps || defaultFollowUps;

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <Card>
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Upcoming Follow-ups</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {isLoading ? (
          <div className="p-3 text-center text-gray-500">Loading follow-ups...</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {displayFollowUps.map((followUp) => (
              <li key={followUp.id} className="p-3 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{followUp.patientName}</div>
                    <div className="text-sm text-gray-500">{followUp.patientMRN}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {isToday(followUp.date) ? "Today" : "Tomorrow"}
                    </div>
                    <div className="text-xs text-gray-500">{followUp.time}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
