import Link from "next/link";

export default function HomeButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Link
        href="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-colors duration-200"
      >
        Home
      </Link>
    </div>
  );
}