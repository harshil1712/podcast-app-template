import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { AdminAuth } from "~/services/auth.server";

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const loader: LoaderFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  const session = await auth.getSession(request);
  if (session && session.email) {
    return redirect("/admin");
  }
  return Response.json({});
};

export const action: ActionFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/admin";

  if (!email || typeof email !== "string") {
    return Response.json(
      { errors: { email: "Email is required" } },
      { status: 400 }
    );
  }

  if (!password || typeof password !== "string") {
    return Response.json(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  const user = await auth.login(email, password, redirectTo.toString());
  if (!user) {
    return Response.json(
      { errors: { email: "Invalid login credentials" } },
      { status: 400 }
    );
  }

  return user;
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Admin Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6">
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {actionData?.errors?.email && (
                  <div className="text-red-600 text-sm mt-1">
                    {actionData.errors.email}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {actionData?.errors?.password && (
                  <div className="text-red-600 text-sm mt-1">
                    {actionData.errors.password}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
