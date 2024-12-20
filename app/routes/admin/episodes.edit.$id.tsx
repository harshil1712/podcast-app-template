import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData, useActionData } from "@remix-run/react";
import EpisodeForm from "~/components/EpisodeForm";
import { AdminAuth } from "~/services/auth.server";
import { D1Service } from "~/utils/db.server";
import { R2Service } from "~/utils/r2.server";
import { Episode } from "~/types";

interface ActionData {
  errors?: {
    title?: string;
    description?: string;
    general?: string;
  };
}

export const loader: LoaderFunction = async ({ params, request, context }) => {
  const episodeId = params.episodeId;
  const db = new D1Service(context.cloudflare.env.DB);

  if (typeof episodeId !== "string") {
    throw new Error("Invalid episode ID");
  }

  try {
    // Here you would fetch the episode from your database
    const episode = await db.getEpisode(episodeId);

    return Response.json({ episode });
  } catch (error) {
    throw new Response("Episode not found", { status: 404 });
  }
};

export const action: ActionFunction = async ({ request, params, context }) => {
  const auth = new AdminAuth(context);
  await auth.requireAdmin(request);

  const episodeId = params.episodeId;
  if (typeof episodeId !== "string") {
    throw new Error("Invalid episode ID");
  }

  const db = new D1Service(context.cloudflare.env.DB);
  const r2 = new R2Service(context.cloudflare.env.BUCKET);

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const audio = formData.get("audio") as File;
  const thumbnail = formData.get("thumbnail") as File;

  const errors: ActionData["errors"] = {};

  if (!title || typeof title !== "string") {
    errors.title = "Title is required";
  }

  if (!description || typeof description !== "string") {
    errors.description = "Description is required";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  try {
    const updateData: Partial<Episode> = {
      id: episodeId,
    };

    if (title && typeof title === "string") {
      updateData.title = title;
    }

    if (description && typeof description === "string") {
      updateData.description = description;
    }

    if (audio.size > 0) {
      const audioObject = await r2.uploadAudio(audio);
      if (audioObject?.key) {
        updateData.audioKey = audioObject.key;
      }
    }

    if (thumbnail.size > 0) {
      const thumbnailObject = await r2.uploadImage(thumbnail);
      if (thumbnailObject?.key) {
        updateData.thumbnailKey = thumbnailObject.key;
      }
    }

    await db.updateEpisode(episodeId, updateData);

    return redirect("/admin/episodes");
  } catch (error) {
    console.log(error);
    return Response.json(
      { errors: { general: "Failed to update episode" } },
      { status: 500 }
    );
  }
};

export default function EditEpisode() {
  const { episode } = useLoaderData<{ episode: Episode }>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Episode: {episode.title}
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6">
          <EpisodeForm
            initialData={{
              title: episode.title || "",
              description: episode.description || "",
            }}
          />
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
