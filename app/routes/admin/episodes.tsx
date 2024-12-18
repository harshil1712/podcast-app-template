import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Link } from "@remix-run/react";

interface Episode {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  listens: number;
  status: "draft" | "published";
}

export const loader: LoaderFunction = async () => {
  // This would fetch from your database
  const episodes: Episode[] = [
    {
      id: "1",
      title: "The Future of AI",
      publishedAt: "2024-12-15",
      duration: "45 min",
      listens: 1234,
      status: "published",
    },
    // Add more episodes
  ];

  return Response.json({ episodes });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const episodeId = formData.get("episodeId");

  if (intent === "delete" && typeof episodeId === "string") {
    // Delete the episode
    return redirect("/admin/episodes");
  }

  return null;
};

export default function AdminEpisodes() {
  const { episodes } = useLoaderData<{ episodes: Episode[] }>();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Episodes</h1>
        <Link
          to="new"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Episode</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Listens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {episodes.map((episode) => (
              <tr key={episode.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {episode.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(episode.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {episode.duration}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {episode.listens.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      episode.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {episode.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`edit/${episode.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil size={18} />
                    </Link>
                    <form method="post" className="inline">
                      <input
                        type="hidden"
                        name="episodeId"
                        value={episode.id}
                      />
                      <button
                        type="submit"
                        name="intent"
                        value="delete"
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
