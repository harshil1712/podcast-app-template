import { Link } from "@remix-run/react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  return (
    <div className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          to={`${baseUrl}?page=${currentPage - 1}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          to={`${baseUrl}?page=${page}`}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            page === currentPage
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          to={`${baseUrl}?page=${currentPage + 1}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
