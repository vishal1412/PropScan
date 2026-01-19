const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection string - update with your actual connection string
const MONGODB_URI = 'mongodb+srv://propscan-admin:qUAox20rtrS2VUNo@propscan-cluster.xqxrqmd.mongodb.net/?appName=propscan-cluster&retryWrites=true&w=majority';
const DB_NAME = 'propscan';

async function uploadData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(DB_NAME);
    
    // Upload properties
    console.log('\n📦 Uploading properties...');
    const propertiesPath = path.join(__dirname, 'src', 'public', 'data', 'properties.json');
    const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
    const propertiesCollection = db.collection('properties');
    
    // Delete existing properties and insert new
    await propertiesCollection.deleteMany({});
    await propertiesCollection.insertOne(properties);
    console.log('✅ Properties uploaded successfully!');
    console.log(`   - Gurgaon: ${properties.gurgaon?.length || 0} properties`);
    console.log(`   - Noida: ${properties.noida?.length || 0} properties`);
    console.log(`   - Dubai: ${properties.dubai?.length || 0} properties`);
    
    // Upload cities (already exists, but let's verify)
    console.log('\n🌆 Uploading cities...');
    const citiesPath = path.join(__dirname, 'src', 'public', 'data', 'cities.json');
    const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
    const citiesCollection = db.collection('cities');
    
    await citiesCollection.deleteMany({});
    await citiesCollection.insertOne({ cities: citiesData });
    console.log('✅ Cities uploaded successfully!');
    console.log(`   - Total cities: ${citiesData.length}`);
    
    // Upload hero section
    console.log('\n🎯 Uploading hero section...');
    const heroPath = path.join(__dirname, 'src', 'public', 'data', 'heroSection.json');
    const heroData = JSON.parse(fs.readFileSync(heroPath, 'utf8'));
    const heroCollection = db.collection('hero-section');
    
    await heroCollection.deleteMany({});
    await heroCollection.insertOne(heroData);
    console.log('✅ Hero section uploaded successfully!');
    
    // Upload about us
    console.log('\n📄 Uploading about us...');
    const aboutPath = path.join(__dirname, 'src', 'public', 'data', 'aboutUs.json');
    const aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    const aboutCollection = db.collection('about-us');
    
    await aboutCollection.deleteMany({});
    await aboutCollection.insertOne(aboutData);
    console.log('✅ About us uploaded successfully!');
    
    // Upload testimonials
    console.log('\n💬 Uploading testimonials...');
    const testimonialsPath = path.join(__dirname, 'src', 'public', 'data', 'testimonials.json');
    const testimonialsData = JSON.parse(fs.readFileSync(testimonialsPath, 'utf8'));
    const testimonialsCollection = db.collection('testimonials');
    
    if (Array.isArray(testimonialsData) && testimonialsData.length > 0) {
      await testimonialsCollection.deleteMany({});
      await testimonialsCollection.insertMany(testimonialsData);
      console.log(`✅ Testimonials uploaded successfully! (${testimonialsData.length} testimonials)`);
    } else {
      console.log('⚠️  No testimonials to upload');
    }
    
    console.log('\n✨ All data uploaded successfully to MongoDB Atlas!');
    console.log('\n🔗 You can verify the data at: https://cloud.mongodb.com/');
    
  } catch (error) {
    console.error('❌ Error uploading data:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n👋 Connection closed');
  }
}

// Run the upload
uploadData();
