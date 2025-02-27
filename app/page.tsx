export default function Home() {
  return (
    <div className="min-h-screen bg-[#0C2340] text-white">
      {/* Hero Section */}
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

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">AI-Powered Generation</h3>
            <p>Describe what you want, and our AI will generate clean, responsive HTML code in seconds.</p>
          </div>
          
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Real-time Preview</h3>
            <p>See your HTML render in real-time as you make changes to the code.</p>
          </div>
          
          <div className="bg-[#0A1D33] p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-3">Export & Share</h3>
            <p>Easily export your HTML or share it with others with a single click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
