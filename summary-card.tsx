import { Card, CardContent } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "purple";
}

export default function SummaryCard({ title, value, icon, color }: SummaryCardProps) {
  const colorMap = {
    blue: "bg-blue-100 text-primary",
    green: "bg-green-100 text-secondary",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className={`rounded-full p-2 ${colorMap[color]} mr-3`}>
            {icon}
          </div>
          <div>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-xl font-bold">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
