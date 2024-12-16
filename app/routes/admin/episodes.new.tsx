import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import EpisodeForm from "~/components/EpisodeForm";
// import { requireAdmin } from "~/lib/auth.server";

interface ActionData {
  errors?: {
    title?: string;
    description?: string;
    audio?: string;
    thumbnail?: string;
    hosts?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
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

  if (!audio) {
    errors.audio = "Audio file is required";
  }

  if (!thumbnail) {
    errors.thumbnail = "Thumbnail is required";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    // Here you would:
    // 1. Upload the audio file to R2
    // 2. Upload the thumbnail to R2
    // 3. Create the episode record in your database
    // 4. Process the audio file with Workers AI for transcription

    return redirect("/admin/episodes");
  } catch (error) {
    return Response.json(
      { errors: { title: "Failed to create episode" } },
      { status: 500 }
    );
  }
};

export default function NewEpisode() {
  const actionData = useActionData<ActionData>();

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Episode
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <EpisodeForm />
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
