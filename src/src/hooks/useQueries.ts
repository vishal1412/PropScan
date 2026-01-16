import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Testimonial, Lead, UserProfile, City, Property } from '../backend.d';

export function useGetHeroSection() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['heroSection'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getHeroSection();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
  });
}

export function useGetAboutUsSection() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['aboutUsSection'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAboutUsSection();
    },
    enabled: !!actor && !isFetching,
    retry: 3,
  });
}

export function useGetTestimonials() {
  const { actor, isFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getTestimonials();
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
  });
}

export function useGetLeads() {
  const { actor, isFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLeads();
    },
    enabled: !!actor && !isFetching,
    retry: 2,
  });
}

export function useGetCities() {
  const { actor, isFetching } = useActor();

  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const cities = await actor.getCities();
        console.log('Cities fetched successfully:', cities.length);
        return cities;
      } catch (error: any) {
        console.warn('Error fetching cities:', error.message || error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    staleTime: 30 * 1000,
    refetchOnMount: true,
  });
}

export function useGetPropertiesByCity(citySlug: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['properties', citySlug],
    queryFn: async () => {
      if (!actor || !citySlug) return [];
      try {
        const properties = await actor.getPropertiesByCity(citySlug);
        console.log(`Properties fetched for ${citySlug}:`, properties.length);
        return properties;
      } catch (error) {
        console.error('Error fetching properties:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!citySlug,
    retry: 3,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

export function useGetAllProperties() {
  const { actor, isFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: ['allProperties'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProperties();
      } catch (error) {
        console.error('Error fetching all properties:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    staleTime: 0,
    refetchOnMount: 'always',
  });
}

export function useSubmitLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullName: string;
      mobileNumber: string;
      email: string;
      cityInterested: string;
      budgetRange: string;
      purpose: string;
      message: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitLead(
        data.fullName,
        data.mobileNumber,
        data.email,
        data.cityInterested,
        data.budgetRange,
        data.purpose,
        data.message
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useAddTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; city: string; feedback: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addTestimonial(data.name, data.city, data.feedback);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; city: string; feedback: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTestimonial(data.id, data.name, data.city, data.feedback);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteTestimonial(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    },
  });
}

export function useAddCity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; slug: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!data.name.trim() || !data.slug.trim()) {
        throw new Error('City name and slug are required');
      }
      console.log(`Adding city: ${data.name} (${data.slug})`);
      await actor.addCity(data.name, data.slug);
      await new Promise(resolve => setTimeout(resolve, 800));
    },
    onSuccess: async () => {
      console.log('City added successfully, invalidating cache');
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
      await queryClient.refetchQueries({ queryKey: ['cities'], type: 'active' });
    },
    retry: 3,
    retryDelay: 1000,
  });
}

export function useUpdateCity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; name: string; slug: string }) => {
      if (!actor) throw new Error('Actor not available');
      if (!data.name.trim() || !data.slug.trim()) {
        throw new Error('City name and slug are required');
      }
      return actor.updateCity(data.id, data.name, data.slug);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
    },
  });
}

export function useDeleteCity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCity(id);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cities'] });
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      await queryClient.invalidateQueries({ queryKey: ['allProperties'] });
    },
  });
}

export function useAddProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
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
      imageUrl?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!data.projectName.trim() || !data.builder.trim() || !data.priceRange.trim()) {
        throw new Error('Project name, builder, and price range are required');
      }
      console.log(`Adding property: ${data.projectName} to ${data.citySlug}`);
      const allProperties = await actor.addProperty(
        data.citySlug,
        data.projectName,
        data.builder,
        data.priceRange,
        data.sizes,
        data.location,
        data.possession,
        data.paymentPlan,
        data.highlights,
        data.prosAndCons
      );
      return { allProperties, citySlug: data.citySlug };
    },
    onSuccess: async ({ allProperties, citySlug }) => {
      console.log(`Property added successfully to ${citySlug}, updating cache`);
      
      queryClient.setQueryData(['allProperties'], allProperties);
      
      const cityProperties = allProperties.filter(p => p.citySlug === citySlug);
      queryClient.setQueryData(['properties', citySlug], cityProperties);
      
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      await queryClient.invalidateQueries({ queryKey: ['allProperties'] });
      
      await queryClient.refetchQueries({ queryKey: ['properties', citySlug] });
    },
    retry: 2,
    retryDelay: 1000,
  });
}

export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
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
      imageUrl?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      if (!data.projectName.trim() || !data.builder.trim() || !data.priceRange.trim()) {
        throw new Error('Project name, builder, and price range are required');
      }
      const allProperties = await actor.updateProperty(
        data.id,
        data.citySlug,
        data.projectName,
        data.builder,
        data.priceRange,
        data.sizes,
        data.location,
        data.possession,
        data.paymentPlan,
        data.highlights,
        data.prosAndCons
      );
      return { allProperties, citySlug: data.citySlug };
    },
    onSuccess: async ({ allProperties, citySlug }) => {
      console.log(`Property updated successfully in ${citySlug}, updating cache`);
      
      queryClient.setQueryData(['allProperties'], allProperties);
      
      const cityProperties = allProperties.filter(p => p.citySlug === citySlug);
      queryClient.setQueryData(['properties', citySlug], cityProperties);
      
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      await queryClient.invalidateQueries({ queryKey: ['allProperties'] });
      
      await queryClient.refetchQueries({ queryKey: ['properties', citySlug] });
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: bigint; citySlug: string }) => {
      if (!actor) throw new Error('Actor not available');
      const allProperties = await actor.deleteProperty(data.id);
      return { allProperties, citySlug: data.citySlug };
    },
    onSuccess: async ({ allProperties, citySlug }) => {
      console.log(`Property deleted successfully from ${citySlug}, updating cache`);
      
      queryClient.setQueryData(['allProperties'], allProperties);
      
      const cityProperties = allProperties.filter(p => p.citySlug === citySlug);
      queryClient.setQueryData(['properties', citySlug], cityProperties);
      
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      await queryClient.invalidateQueries({ queryKey: ['allProperties'] });
      
      await queryClient.refetchQueries({ queryKey: ['properties', citySlug] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) return null;
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 2,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['isCallerAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      if (!identity) return false;
      try {
        const result = await actor.isCallerAdmin();
        console.log('Admin status check result:', result);
        return result;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: 3,
    retryDelay: 500,
    staleTime: 2 * 1000,
    gcTime: 5 * 1000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && !actorFetching && query.isFetched,
  };
}
