// Simple PNG icon generator using Canvas API
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Function to create icon of specified size
function createIcon(size) {
  canvas.width = size;
  canvas.height = size;
  
  // Clear canvas
  ctx.clearRect(0, 0, size, size);
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#2563eb');
  gradient.addColorStop(1, '#7c3aed');
  
  // Draw rounded rectangle background
  const radius = size * 0.15;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  
  // Draw W3 text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.25}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('W3', size / 2, size / 2);
  
  return canvas.toDataURL('image/png');
}

// Log the data URLs for different sizes
console.log('144x144:', createIcon(144));
console.log('192x192:', createIcon(192));
console.log('512x512:', createIcon(512));