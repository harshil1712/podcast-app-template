import { Link, useLocation, Form } from "@remix-run/react";
import { LayoutGrid, Mic, Settings, BarChart, LogOut } from "lucide-react";

export default function AdminNav() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/admin", icon: LayoutGrid, label: "Dashboard" },
    { path: "/admin/episodes", icon: Mic, label: "Episodes" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
    { path: "/admin/analytics", icon: BarChart, label: "Analytics" },
  ];

  return (
    <nav className="bg-gray-900 text-gray-100 w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">PodcastApp Admin</h1>
      </div>
      <div className="space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              isActive(path)
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </Form>
      </div>
    </nav>
  );
}
