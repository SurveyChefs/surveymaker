import Link from "next/link";

export default function HomeButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/"
        className="bg-gray-800 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors duration-200 border-2 border-white"
        >
        Home
      </Link>
    </div>
  );
}