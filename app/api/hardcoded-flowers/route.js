import { NextResponse } from 'next/server'

export async function POST(req) {
  console.log('[hardcoded-flowers API] Request received');
  
  // Create a hardcoded HTML response about flowers
  const hardcodedHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Beautiful Flowers Landing Page</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
    }
    header {
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
      color: white;
      text-align: center;
      padding: 3rem 1rem;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .subtitle {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-block;
      background-color: white;
      color: #ff9a9e;
      padding: 0.8rem 1.8rem;
      border-radius: 30px;
      text-decoration: none;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 10px rgba(0,0,0,0.15);
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 1rem;
    }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin: 3rem 0;
    }
    .feature {
      background-color: white;
      border-radius: 10px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.3s ease;
    }
    .feature:hover {
      transform: translateY(-10px);
    }
    .feature h3 {
      margin: 1rem 0;
      color: #ff9a9e;
    }
    .feature-icon {
      font-size: 2.5rem;
      color: #ff9a9e;
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin: 3rem 0;
    }
    .gallery-item {
      height: 250px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .gallery-item:hover img {
      transform: scale(1.1);
    }
    footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 2rem;
    }
    @media (max-width: 768px) {
      h1 {
        font-size: 2.5rem;
      }
      .features, .gallery {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <h1>Beautiful Flowers</h1>
    <p class="subtitle">Discover the beauty and elegance of nature's most colorful creations</p>
    <a href="#contact" class="btn">Order Now</a>
  </header>

  <div class="container">
    <h2>Why Choose Our Flowers?</h2>
    <div class="features">
      <div class="feature">
        <div class="feature-icon">🌷</div>
        <h3>Fresh & Vibrant</h3>
        <p>All our flowers are freshly cut and carefully selected to ensure maximum beauty and longevity.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🚚</div>
        <h3>Fast Delivery</h3>
        <p>We deliver your flowers within hours, ensuring they arrive as fresh as when they were picked.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💐</div>
        <h3>Custom Arrangements</h3>
        <p>Create your own unique bouquet with our wide selection of seasonal blooms.</p>
      </div>
    </div>

    <h2>Our Collection</h2>
    <div class="gallery">
      <div class="gallery-item">
        <img src="https://source.unsplash.com/random/600x600/?roses" alt="Roses">
      </div>
      <div class="gallery-item">
        <img src="https://source.unsplash.com/random/600x600/?tulips" alt="Tulips">
      </div>
      <div class="gallery-item">
        <img src="https://source.unsplash.com/random/600x600/?lilies" alt="Lilies">
      </div>
      <div class="gallery-item">
        <img src="https://source.unsplash.com/random/600x600/?sunflower" alt="Sunflowers">
      </div>
    </div>
    
    <div id="contact">
      <h2>Contact Us</h2>
      <p>Ready to order or have questions? Reach out to us!</p>
      <form style="max-width: 500px; margin: 2rem auto;">
        <div style="margin-bottom: 1rem;">
          <label for="name" style="display: block; margin-bottom: 0.5rem;">Name</label>
          <input type="text" id="name" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label for="email" style="display: block; margin-bottom: 0.5rem;">Email</label>
          <input type="email" id="email" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div style="margin-bottom: 1rem;">
          <label for="message" style="display: block; margin-bottom: 0.5rem;">Message</label>
          <textarea id="message" rows="4" style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>
        </div>
        <button type="submit" style="background-color: #ff9a9e; color: white; border: none; padding: 0.8rem 1.8rem; border-radius: 30px; cursor: pointer; font-weight: bold;">Send Message</button>
      </form>
    </div>
  </div>

  <footer>
    <p>&copy; 2025 Beautiful Flowers. All rights reserved.</p>
  </footer>
</body>
</html>`;

  // Return HTML directly
  console.log('[hardcoded-flowers API] Returning hardcoded HTML about flowers');
  
  return new NextResponse(hardcodedHtml, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
