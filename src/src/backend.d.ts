// Type definitions for backend canister types

export interface Property {
  id: bigint;
  citySlug: string;
  projectName: string;
  builder: string;
  priceRange: string;
  sizes: string;
  location: string;
  possession: string;
  paymentPlan: string;
  highlights: string;
  prosAndCons: string;
  imageUrl: string;
}

export interface Testimonial {
  id: bigint;
  name: string;
  city: string;
  feedback: string;
}

export interface Lead {
  id: bigint;
  fullName: string;
  email: string;
  mobileNumber: string;
  cityInterested: string;
  budgetRange: string;
  purpose: string;
  message: string;
  createdAt: bigint;
}

export interface UserProfile {
  id: bigint;
  name: string;
  email: string;
}

export interface City {
  slug: string;
  name: string;
  description: string;
}
