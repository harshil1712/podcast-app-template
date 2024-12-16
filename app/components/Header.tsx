import { Link } from "@remix-run/react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">
                PodcastApp
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/episodes"
                className="text-gray-600 hover:text-gray-900"
              >
                All Episodes
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
