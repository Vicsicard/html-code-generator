'use client';

import React from 'react';

export default function FlowersPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-r from-pink-300 to-purple-300 text-white text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Beautiful Flowers</h1>
        <p className="text-xl mb-6">Discover the beauty and elegance of nature's finest creations</p>
        <button className="bg-white text-pink-500 font-semibold px-6 py-2 rounded-full hover:bg-pink-100 transition-colors">
          Explore Our Collection
        </button>
      </header>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Most Popular Flowers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Roses', description: 'The classic symbol of love and beauty', color: 'bg-red-100' },
            { name: 'Tulips', description: 'Elegant blooms in vibrant spring colors', color: 'bg-yellow-100' },
            { name: 'Lilies', description: 'Sophisticated flowers with a sweet fragrance', color: 'bg-purple-100' },
            { name: 'Sunflowers', description: 'Bright and cheerful blooms that follow the sun', color: 'bg-yellow-100' },
            { name: 'Orchids', description: 'Exotic and delicate flowers of rare beauty', color: 'bg-pink-100' },
            { name: 'Daisies', description: 'Simple and charming flowers with a happy feel', color: 'bg-white' }
          ].map((flower, index) => (
            <div key={index} className={`p-6 rounded-lg shadow-md ${flower.color}`}>
              <h3 className="text-xl font-semibold mb-2">{flower.name}</h3>
              <p className="text-gray-700">{flower.description}</p>
              <button className="mt-4 text-pink-600 font-medium hover:text-pink-800">
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Flowers?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-4">🌷</div>
              <h3 className="text-xl font-semibold mb-2">Freshly Cut Daily</h3>
              <p className="text-gray-600">Our flowers are harvested each morning to ensure maximum freshness.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery available for orders placed before noon.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-3xl mb-4">💐</div>
              <h3 className="text-xl font-semibold mb-2">Custom Arrangements</h3>
              <p className="text-gray-600">Create your own unique bouquet with our wide variety of blooms.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Customers Say</h2>
        
        <div className="bg-pink-50 p-8 rounded-lg shadow-sm italic">
          <p className="text-lg mb-4">
            "The flowers I ordered for my mother's birthday were absolutely stunning. They arrived on time and stayed fresh for over two weeks!"
          </p>
          <p className="font-semibold text-pink-600">- Sarah Johnson</p>
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-300 to-purple-300 text-white py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to brighten someone's day?</h2>
        <p className="text-xl mb-8">Order a beautiful bouquet today and make someone smile!</p>
        <button className="bg-white text-pink-500 font-semibold px-8 py-3 rounded-full hover:bg-pink-100 transition-colors">
          Order Now
        </button>
      </section>

      <footer className="bg-gray-800 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Beautiful Flowers</h3>
            <p className="text-gray-400">Bringing nature's beauty to your doorstep since 2010.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-400">123 Flower Street<br />Bloomington, FL 54321<br />555-123-4567</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <p className="text-gray-400">Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm<br />Sunday: Closed</p>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2025 Beautiful Flowers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
