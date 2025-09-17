import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  description: string | null;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface TripActivity {
  id: string;
  trip_id: string;
  title: string;
  description: string | null;
  location: string | null;
  scheduled_time: string | null;
  duration_minutes: number | null;
  activity_type: 'general' | 'transport' | 'accommodation' | 'dining' | 'sightseeing' | 'meeting';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useTrips = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!user?.id,
  });

  const createTripMutation = useMutation({
    mutationFn: async (tripData: Omit<Trip, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          ...tripData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', user?.id] });
      toast({
        title: "Trip Created",
        description: "Your trip has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create trip.",
        variant: "destructive",
      });
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Trip> & { id: string }) => {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips', user?.id] });
      toast({
        title: "Trip Updated",
        description: "Your trip has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update trip.",
        variant: "destructive",
      });
    },
  });

  return {
    trips: trips || [],
    isLoading,
    createTrip: createTripMutation.mutate,
    updateTrip: updateTripMutation.mutate,
    isCreating: createTripMutation.isPending,
    isUpdating: updateTripMutation.isPending,
  };
};

export const useTripActivities = (tripId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['trip-activities', tripId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trip_activities')
        .select('*')
        .eq('trip_id', tripId)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;
      return data as TripActivity[];
    },
    enabled: !!tripId,
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activityData: Omit<TripActivity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('trip_activities')
        .insert(activityData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-activities', tripId] });
      toast({
        title: "Activity Added",
        description: "Activity has been added to your trip.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Activity",
        description: error.message || "Failed to add activity.",
        variant: "destructive",
      });
    },
  });

  return {
    activities: activities || [],
    isLoading,
    createActivity: createActivityMutation.mutate,
    isCreating: createActivityMutation.isPending,
  };
};