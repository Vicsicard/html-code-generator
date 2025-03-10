export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C2340] text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl mb-6">Page Not Found</h2>
        <p className="mb-8">The page you are looking for does not exist or has been moved.</p>
        <a 
          href="/" 
          className="bg-[#F47920] text-white px-6 py-2 rounded-lg hover:bg-[#D96510] transition-all"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
