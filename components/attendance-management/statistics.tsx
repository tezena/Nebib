import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function Statistics() {
  // Sample data for the chart
  const sessionData = [
    { session: "session 1", value: 180, color: "#a5a6f6" },
    { session: "session 2", value: 260, color: "#5de0c4" },
    { session: "session 3", value: 220, color: "#000000" },
    { session: "session 4", value: 200, color: "#a5c8f6" },
    { session: "session 5", value: 280, color: "#a5b8f6" },
    { session: "session 6", value: 240, color: "#8de0a5" },
  ];

  // Find the maximum value for scaling the chart
  const maxValue = Math.max(...sessionData.map((item) => item.value));

  const attendanceData = [
    { session: "session 1", students: 180 },
    { session: "session 2", students: 260 },
    { session: "session 3", students: 220 },
    { session: "session 4", students: 200 },
    { session: "session 5", students: 280 },
    { session: "session 6", students: 240 },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="w-full p-3 ">
        {/* Top section with cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {/* Bible Study Info Card */}
          <div className="bg-blue-50 rounded-lg flex flex-col gap-2 justify-center p-4 lg:col-span-1">
            <h2 className="text-xl sm:text-2xl lg:text-center font-bold mb-2">
              Bible Study
            </h2>
            <div className="space-y-3 lg:text-center text-gray-600 text-xs sm:text-sm">
              <p>Instructor: FR abebe</p>
              <p>Start date: 20/10/2017</p>
              <p>End date: 20/12/2017</p>
              <p>Total Sessions Planned: 10</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-3">
            <div className="bg-pink-100 rounded-lg p-3 lg:py-12 py-8 md:px-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">450</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                Total Students
              </p>
            </div>
            <div className="bg-pink-100 rounded-lg p-3 lg:py-12 py-8 md:px-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">300</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                Active Students
              </p>
            </div>
            <div className="bg-pink-100 rounded-lg p-3 lg:py-12 py-8 md:px-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">7</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                completed sessions
              </p>
            </div>
            <div className="bg-pink-100 rounded-lg p-3 lg:py-12 py-8 md:px-4 flex flex-col items-center justify-center">
              <h3 className="text-2xl sm:text-3xl font-bold">25%</h3>
              <p className="text-gray-600 text-xs sm:text-sm text-center">
                Average attendance rate
              </p>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-2">no of students</p>

          <ChartContainer
            config={{
              students: {
                label: "Students",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <BarChart
              data={attendanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              accessibilityLayer
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="session"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickCount={4}
                domain={[0, 450]}
                ticks={[0, 150, 300, 450]}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="students"
                radius={[4, 4, 0, 0]}
                barSize={40}
                fill="var(--color-students)"
              />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
