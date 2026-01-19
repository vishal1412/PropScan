const { MongoClient } = require('mongodb');

// MongoDB connection - Set MONGODB_URI in Vercel environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'propscan';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  // Reuse existing connection if available
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Get a collection
async function getCollection(collectionName) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Properties operations
async function getProperties() {
  const collection = await getCollection('properties');
  const docs = await collection.find({}).toArray();
  
  // Return in expected format: { gurgaon: [], noida: [], dubai: [] }
  if (docs.length === 0) {
    return { gurgaon: [], noida: [], dubai: [] };
  }
  
  // If we have a document with city structure, return it
  const propertiesDoc = docs[0];
  if (propertiesDoc.gurgaon || propertiesDoc.noida || propertiesDoc.dubai) {
    return propertiesDoc;
  }
  
  // Otherwise initialize empty structure
  return { gurgaon: [], noida: [], dubai: [] };
}

async function updateProperties(properties) {
  const collection = await getCollection('properties');
  
  // Upsert: update if exists, insert if doesn't
  await collection.updateOne(
    {},
    { $set: properties },
    { upsert: true }
  );
}

// Testimonials operations
async function getTestimonials() {
  const collection = await getCollection('testimonials');
  return await collection.find({}).toArray();
}

async function addTestimonial(testimonial) {
  const collection = await getCollection('testimonials');
  const result = await collection.insertOne(testimonial);
  return { ...testimonial, _id: result.insertedId };
}

async function updateTestimonial(id, updates) {
  const collection = await getCollection('testimonials');
  await collection.updateOne({ id }, { $set: updates });
}

async function deleteTestimonial(id) {
  const collection = await getCollection('testimonials');
  await collection.deleteOne({ id });
}

// Leads operations
async function getLeads() {
  const collection = await getCollection('leads');
  return await collection.find({}).toArray();
}

async function addLead(lead) {
  const collection = await getCollection('leads');
  const result = await collection.insertOne(lead);
  return { ...lead, _id: result.insertedId };
}

async function deleteLead(id) {
  const collection = await getCollection('leads');
  await collection.deleteOne({ id });
}

// Resale Properties operations
async function getResaleProperties(status = null) {
  const collection = await getCollection('resale-properties');
  const filter = status ? { approvalStatus: status } : {};
  return await collection.find(filter).toArray();
}

async function addResaleProperty(property) {
  const collection = await getCollection('resale-properties');
  const result = await collection.insertOne(property);
  return { ...property, _id: result.insertedId };
}

async function updateResaleProperty(id, updates) {
  const collection = await getCollection('resale-properties');
  await collection.updateOne({ id }, { $set: updates });
}

async function deleteResaleProperty(id) {
  const collection = await getCollection('resale-properties');
  await collection.deleteOne({ id });
}

// Cities operations
async function getCities() {
  const collection = await getCollection('cities');
  const cities = await collection.find({}).toArray();
  return cities.length > 0 ? cities : [];
}

async function updateCities(cities) {
  const collection = await getCollection('cities');
  // Clear existing and insert new
  await collection.deleteMany({});
  if (cities.length > 0) {
    await collection.insertMany(cities);
  }
}

// Hero Section operations
async function getHeroSection() {
  const collection = await getCollection('hero-section');
  const docs = await collection.find({}).toArray();
  
  if (docs.length === 0) {
    return {
      headline: 'Your Trusted Property Intelligence Partner',
      subheadline: 'Compare, Discover, and Invest in Gurgaon, Noida & Dubai with Confidence'
    };
  }
  
  return docs[0];
}

async function updateHeroSection(data) {
  const collection = await getCollection('hero-section');
  await collection.updateOne(
    {},
    { $set: data },
    { upsert: true }
  );
}

// About Us operations
async function getAboutUs() {
  const collection = await getCollection('about-us');
  const docs = await collection.find({}).toArray();
  
  if (docs.length === 0) {
    return {
      content: 'PropScan Intelligence is committed to providing transparent, data-driven real estate advisory services.'
    };
  }
  
  return docs[0];
}

async function updateAboutUs(data) {
  const collection = await getCollection('about-us');
  await collection.updateOne(
    {},
    { $set: data },
    { upsert: true }
  );
}

module.exports = {
  connectToDatabase,
  getCollection,
  getProperties,
  updateProperties,
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getLeads,
  addLead,
  deleteLead,
  getResaleProperties,
  addResaleProperty,
  updateResaleProperty,
  deleteResaleProperty,
  getCities,
  updateCities,
  getHeroSection,
  updateHeroSection,
  getAboutUs,
  updateAboutUs,
};
