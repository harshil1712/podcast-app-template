import { Form } from "@remix-run/react";

interface EpisodeFormProps {
  initialData?: {
    title: string;
    description: string;
    hosts: string[];
  };
}

export default function EpisodeForm({ initialData }: EpisodeFormProps) {
  return (
    <Form method="post" className="space-y-6" encType="multipart/form-data">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Episode Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          defaultValue={initialData?.title}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          defaultValue={initialData?.description}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="audio"
            className="block text-sm font-medium text-gray-700"
          >
            Audio File
          </label>
          <input
            type="file"
            name="audio"
            id="audio"
            accept="audio/*"
            className="mt-1 block w-full"
            required={!initialData}
          />
        </div>

        <div>
          <label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Thumbnail Image
          </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            accept="image/*"
            className="mt-1 block w-full"
            required={!initialData}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="hosts"
          className="block text-sm font-medium text-gray-700"
        >
          Hosts (comma-separated)
        </label>
        <input
          type="text"
          name="hosts"
          id="hosts"
          defaultValue={initialData?.hosts?.join(", ")}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {initialData ? "Update Episode" : "Create Episode"}
        </button>
      </div>
    </Form>
  );
}
