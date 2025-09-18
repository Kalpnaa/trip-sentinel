import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface KYCData {
  id: string;
  user_id: string;
  id_type: string;
  id_number: string;
  image_url: string;
  selfie_url: string;
  status: 'pending' | 'verified' | 'rejected';
  kyc_hash: string | null;
  blockchain_tx_hash: string | null;
  created_at: string;
}

export const useKYC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kycData, isLoading } = useQuery({
    queryKey: ['kyc', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('kyc' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;
      return data ? (data as unknown as KYCData) : null;
    },
    enabled: !!user?.id,
  });

  const verifyKYCMutation = useMutation({
    mutationFn: async ({ kycId, tripId }: { kycId: string; tripId: string }) => {
      if (!user?.id) throw new Error('No user');

      // Get trip data to determine validity period
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', tripId)
        .single();

      if (tripError) throw tripError;

      // Create blockchain hash (simulation)
      const kycHash = `kyc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const blockchainTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Update KYC status
      const { error: kycUpdateError } = await supabase
        .from('kyc' as any)
        .update({
          status: 'verified',
          kyc_hash: kycHash,
          blockchain_tx_hash: blockchainTxHash
        })
        .eq('id', kycId);

      if (kycUpdateError) throw kycUpdateError;

      // Generate digital ID number
      const digitalIdNumber = `DID-${tripData.destination.substr(0, 3).toUpperCase()}-${Date.now().toString().substr(-6)}`;
      const tripHash = `trip_${tripId}_${Date.now()}`;
      const qrCodeUrl = `https://verify.digitaltravelid.com/${digitalIdNumber}`;

      // Create digital trip ID
      const { data: digitalId, error: digitalIdError } = await supabase
        .from('digital_trip_ids' as any)
        .insert({
          user_id: user.id,
          trip_id: tripId,
          digital_id_number: digitalIdNumber,
          issued_date: tripData.start_date,
          expiry_date: tripData.end_date,
          trip_hash: tripHash,
          blockchain_tx_hash: blockchainTxHash,
          qr_code_url: qrCodeUrl
        })
        .select()
        .single();

      if (digitalIdError) throw digitalIdError;

      return { digitalId, tripData };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kyc', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['digital-trip-ids', user?.id] });
      
      toast({
        title: "Verification Successful",
        description: `Digital ID created for ${data.tripData.destination} (${(data.digitalId as any).digital_id_number})`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify identity.",
        variant: "destructive",
      });
    },
  });

  return {
    kycData,
    isLoading,
    verifyKYC: verifyKYCMutation.mutate,
    isVerifying: verifyKYCMutation.isPending,
  };
};

export const useDigitalTripIDs = () => {
  const { user } = useAuth();

  const { data: digitalTripIDs, isLoading } = useQuery({
    queryKey: ['digital-trip-ids', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('digital_trip_ids' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  return {
    digitalTripIDs: digitalTripIDs || [],
    isLoading,
  };
};