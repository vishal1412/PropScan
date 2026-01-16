// Node.js script to add testimonial via localStorage simulation
// This simulates what the browser would do

const testimonial = {
    id: `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: 'Ajay Mishra',
    city: 'Noida',
    message: 'wonderful',
    createdAt: new Date().toISOString()
};

console.log('New testimonial to be added:');
console.log(JSON.stringify(testimonial, null, 2));
console.log('\n=== Copy this to localStorage ===');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Press F12 to open DevTools');
console.log('3. Go to Console tab');
console.log('4. Paste this code and press Enter:');
console.log('\n');
console.log(`
// Get existing testimonials
const existing = localStorage.getItem('testimonials_data');
const testimonials = existing ? JSON.parse(existing) : [];

// Add new testimonial
testimonials.push(${JSON.stringify(testimonial)});

// Save back
localStorage.setItem('testimonials_data', JSON.stringify(testimonials));

// Log confirmation
console.log('✅ Testimonial added! Total:', testimonials.length);
console.log('Data:', JSON.stringify(testimonials, null, 2));

// Reload the page to see changes
location.reload();
`);
