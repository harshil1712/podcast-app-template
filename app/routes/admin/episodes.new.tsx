import type { ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import EpisodeForm from "~/components/EpisodeForm";
import { AdminAuth } from "~/services/auth.server";
import { R2Service } from "~/utils/r2.server";
import { D1Service } from "~/utils/db.server";

interface ActionData {
  errors?: {
    title?: string;
    description?: string;
    audio?: string;
    thumbnail?: string;
  };
}

export const action: ActionFunction = async ({ request, context }) => {
  const auth = new AdminAuth(context);
  await auth.requireAdmin(request);

  const r2 = new R2Service(context.cloudflare.env.BUCKET);
  const db = new D1Service(context.cloudflare.env.DB);

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const audio = formData.get("audio") as File;
  const thumbnail = formData.get("thumbnail") as File;
  const duration = (formData.get("duration") || "0").toString();

  const errors: ActionData["errors"] = {};

  if (!title || typeof title !== "string") {
    errors.title = "Title is required";
  }

  if (!description || typeof description !== "string") {
    errors.description = "Description is required";
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
    // Upload the audio file to R2
    const audioObject = await r2.uploadAudio(audio);

    // Upload the thumbnail to R2
    const thumbnailObject = await r2.uploadImage(thumbnail);

    // Save the episode to the database
    await db.createEpisode({
      title,
      description,
      audioKey: audioObject.key,
      thumbnailKey: thumbnailObject.key,
      duration: Number(duration),
    });

    return redirect("/admin/episodes");
  } catch (error) {
    console.log(error);
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
