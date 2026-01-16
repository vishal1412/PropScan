import { useState } from 'react'

export function useActor() {
  const [isFetching] = useState(false)

  const actor = {
    getHeroSection: async () => ({ title: 'Welcome', subtitle: 'Find properties' }),
    getAboutUsSection: async () => ({ title: 'About', body: 'About us' }),
    getTestimonials: async () => [],
    getLeads: async () => [],
    getCities: async () => [
      { id: 0n, name: 'Gurgaon', slug: 'gurgaon' },
      { id: 1n, name: 'Noida', slug: 'noida' },
      { id: 2n, name: 'Dubai', slug: 'dubai' },
    ],
    getPropertiesByCity: async (slug: string) => [],
    getAllProperties: async () => [],
    submitLead: async () => true,
    addTestimonial: async () => true,
    updateTestimonial: async () => true,
    deleteTestimonial: async () => true,
    addCity: async () => true,
    updateCity: async () => true,
    deleteCity: async () => true,
    addProperty: async () => [],
    updateProperty: async () => [],
    deleteProperty: async () => [],
  }

  return { actor, isFetching }
}

export default useActor
