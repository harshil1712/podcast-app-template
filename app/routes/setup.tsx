import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { AdminAuth } from "~/services/auth.server";

interface ActionData {
  errors?: {
    password?: string;
    confirmPassword?: string;
  };
}

export const loader: LoaderFunction = async ({ context }) => {
  const auth = new AdminAuth(context);
  const initialized = await auth.isInitialized();
  if (initialized) {
    return redirect("/login");
  }
  return Response.json({ initialized });
};

export const action: ActionFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (typeof password !== "string" || password.length < 8) {
    return Response.json(
      { errors: { password: "Password must be at least 8 characters" } },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return Response.json(
      { errors: { confirmPassword: "Passwords must match" } },
      { status: 400 }
    );
  }

  await auth.setInitialPassword(password);
  return redirect("/login");
};

export default function Setup() {
  const { initialized } = useLoaderData<{ initialized: boolean }>();
  const actionData = useActionData<ActionData>();

  if (initialized) {
    return <div>Admin account already initialized</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Initialize Admin Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Set up your admin password for CHANGE THIS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Form method="post" className="space-y-6">
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
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {actionData?.errors?.confirmPassword && (
                  <div className="text-red-600 text-sm mt-1">
                    {actionData.errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Admin Account
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
