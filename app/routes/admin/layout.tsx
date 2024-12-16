import { isRouteErrorResponse, Outlet, useRouteError } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/node";
import AdminNav from "~/components/AdminNav";
// import { requireAdmin } from "~/lib/auth.server";

// export const loader: LoaderFunction = async ({ request }) => {
//   // return await requireAdmin(request);
// };

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
