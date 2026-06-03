import { StatCards } from "@/components/dashboard/stat-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { TopServices } from "@/components/dashboard/top-services";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      <StatCards />
      <RevenueChart />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
        <TopServices />
      </div>
    </div>
  );
}
