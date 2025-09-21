import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface LocationLog {
  id: string;
  user_id: string;
  trip_id: string | null;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  address: string | null;
  is_safe_checkin: boolean;
  notes: string | null;
  created_at: string;
}

export const useLocation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    let watchId: number;
    let lastUpdateTime = 0;
    const UPDATE_THRESHOLD = 30000; // 30 seconds minimum between updates

    const startTracking = () => {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const now = Date.now();
          // Only update if enough time has passed or position changed significantly
          if (now - lastUpdateTime >= UPDATE_THRESHOLD) {
            setCurrentLocation(position);
            setLocationError(null);
            lastUpdateTime = now;
          }
        },
        (error) => {
          setLocationError(error.message);
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: false, // Reduce accuracy for better battery life
          timeout: 15000,
          maximumAge: 300000, // 5 minutes - cache location longer
        }
      );
      setIsTracking(true);
    };

    const stopTracking = () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setIsTracking(false);
      }
    };

    startTracking();

    return () => stopTracking();
  }, []);

  const logLocationMutation = useMutation({
    mutationFn: async (locationData: {
      latitude: number;
      longitude: number;
      accuracy?: number;
      altitude?: number;
      address?: string;
      is_safe_checkin?: boolean;
      notes?: string;
      trip_id?: string;
    }) => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await supabase
        .from('location_logs')
        .insert({
          user_id: user.id,
          ...locationData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['location-logs', user?.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Log Location",
        description: error.message || "Failed to save location.",
        variant: "destructive",
      });
    },
  });

  const checkInSafe = async (notes?: string) => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to check in.",
        variant: "destructive",
      });
      return;
    }

    await logLocationMutation.mutateAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      accuracy: currentLocation.coords.accuracy,
      altitude: currentLocation.coords.altitude,
      is_safe_checkin: true,
      notes,
    });

    toast({
      title: "Safe Check-in Successful",
      description: "Your location has been logged as a safe check-in.",
    });
  };

  return {
    currentLocation,
    locationError,
    isTracking,
    logLocation: logLocationMutation.mutate,
    checkInSafe,
    isLogging: logLocationMutation.isPending,
  };
};