import type { LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Play, Users, Clock, TrendingUp } from "lucide-react";
import { D1Service } from "~/utils/db.server";

interface DashboardStats {
  totalEpisodes: number;
  totalListeners: number;
  totalListeningTime: string;
  growth: string;
}

export const loader: LoaderFunction = async ({ context }) => {
  const db = new D1Service(context.cloudflare.env.DB);
  const totalEpisodes = await db.getTotalEpisodes();

  // To Do: Implement tracking logic to get other stats
  const stats: DashboardStats = {
    totalEpisodes: totalEpisodes,
    totalListeners: 1234,
    totalListeningTime: "3,456 hours",
    growth: "+12.5%",
  };

  return Response.json({ stats });
};

export default function AdminDashboard() {
  const { stats } = useLoaderData<{ stats: DashboardStats }>();

  const StatCard = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: typeof Play;
    label: string;
    value: string | number;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-indigo-100 rounded-lg">
          <Icon size={24} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Play}
          label="Total Episodes"
          value={stats.totalEpisodes}
        />
        <StatCard
          icon={Users}
          label="Total Listeners"
          value={stats.totalListeners}
        />
        <StatCard
          icon={Clock}
          label="Total Listening Time"
          value={stats.totalListeningTime}
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Growth"
          value={stats.growth}
        />
      </div>

      {/* Add charts and other dashboard components here */}
    </div>
  );
}
