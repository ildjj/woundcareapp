import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface WoundTypeDistributionProps {
  data?: Array<{ name: string; value: number; color: string }>;
  isLoading?: boolean;
}

export default function WoundTypeDistribution({ 
  data,
  isLoading = false
}: WoundTypeDistributionProps) {
  // Default placeholder data if no data provided
  const defaultData = [
    { name: 'Pressure Injury', value: 35, color: '#1976D2' },
    { name: 'Diabetic Foot', value: 25, color: '#4CAF50' },
    { name: 'Surgical Wound', value: 20, color: '#FF9800' },
    { name: 'Skin Tear', value: 10, color: '#E91E63' },
    { name: 'Burn', value: 5, color: '#9C27B0' },
    { name: 'Infected Wound', value: 3, color: '#F44336' },
    { name: 'Atypical Wound', value: 2, color: '#607D8B' },
  ];

  const chartData = data || defaultData;

  // If there's no data or loading, show placeholder
  if (isLoading || !chartData.length) {
    return (
      <Card>
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg font-bold">Wound Type Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-4 h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <PieChartIcon className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-sm">
              {isLoading 
                ? "Loading chart data..." 
                : "Chart showing distribution of wound types across patients"
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b p-4">
        <CardTitle className="text-lg font-bold">Wound Type Distribution</CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} cases`, 'Count']} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
