export default function IndexPage() {
  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">HTML Code Creator</h1>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-12">
          Effortlessly create beautiful, responsive HTML code with the power of AI
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <a
            href="/auth"
            className="bg-[#F47920] text-white px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-[#D96510] transition-all"
          >
            Get Started
          </a>
          <a
            href="/pricing"
            className="bg-white text-[#0C2340] px-8 py-3 rounded-lg text-lg font-bold uppercase hover:bg-gray-100 transition-all"
          >
            View Pricing
          </a>
        </div>
      </div>
    </div>
  );
}
