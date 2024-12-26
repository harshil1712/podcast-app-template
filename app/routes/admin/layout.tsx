import { Outlet } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import AdminNav from "~/components/AdminNav";
import { AdminAuth } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Admin",
      description: "Admin dashboard",
    },
  ];
};

export const loader: LoaderFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  return await auth.requireAdmin(request);
};

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <div className="flex-1 bg-gradient-to-b from-gray-50 to-white">
        <Outlet />
      </div>
    </div>
  );
}
