import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData, useActionData } from "@remix-run/react";
import EpisodeForm from "~/components/EpisodeForm";
// import { requireAdmin } from "~/lib/auth.server";

interface Episode {
  id: string;
  title: string;
  description: string;
  hosts: string[];
}

interface LoaderData {
  episode: Episode;
}

interface ActionData {
  errors?: {
    title?: string;
    description?: string;
    hosts?: string;
    general?: string;
  };
}

export const loader: LoaderFunction = async ({ params, request }) => {
  // await requireAdmin(request);
  const episodeId = params.episodeId;

  try {
    // Here you would fetch the episode from your database
    const episode: Episode = {
      id: episodeId!,
      title: "Example Episode",
      description: "Example description",
      hosts: ["Host 1", "Host 2"],
    };

    return Response.json({ episode });
  } catch (error) {
    throw new Response("Episode not found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  // await requireAdmin(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const hosts = formData.get("hosts");
  const audio = formData.get("audio");
  const thumbnail = formData.get("thumbnail");

  const errors: ActionData["errors"] = {};

  if (!title || typeof title !== "string") {
    errors.title = "Title is required";
  }

  if (!description || typeof description !== "string") {
    errors.description = "Description is required";
  }

  if (!hosts || typeof hosts !== "string") {
    errors.hosts = "Hosts are required";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    // Here you would:
    // 1. If new files are provided, upload them to R2
    // 2. Update the episode record in your database
    // 3. If new audio is provided, process it with Workers AI for transcription

    return redirect("/admin/episodes");
  } catch (error) {
    return Response.json(
      { errors: { general: "Failed to update episode" } },
      { status: 500 }
    );
  }
};

export default function EditEpisode() {
  const { episode } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Episode: {episode.title}
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <EpisodeForm initialData={episode} />
          {actionData?.errors && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
              <ul className="list-disc list-inside">
                {Object.entries(actionData.errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
