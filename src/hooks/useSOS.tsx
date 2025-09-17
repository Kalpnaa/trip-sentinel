import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useLocation } from './useLocation';
import { useToast } from './use-toast';

export interface SOSAlert {
  id: string;
  user_id: string;
  trip_id: string | null;
  latitude: number | null;
  longitude: number | null;
  location_address: string | null;
  alert_type: 'emergency' | 'medical' | 'security' | 'assistance';
  message: string | null;
  status: 'active' | 'resolved' | 'false_alarm';
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export const useSOS = () => {
  const { user } = useAuth();
  const { currentLocation } = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendSOSMutation = useMutation({
    mutationFn: async (alertData: {
      alert_type: SOSAlert['alert_type'];
      message?: string;
      trip_id?: string;
    }) => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await supabase
        .from('sos_alerts')
        .insert({
          user_id: user.id,
          latitude: currentLocation?.coords.latitude || null,
          longitude: currentLocation?.coords.longitude || null,
          ...alertData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sos-alerts', user?.id] });
      toast({
        title: "SOS Alert Sent",
        description: `${data.alert_type.toUpperCase()} alert has been sent to your emergency contacts.`,
        variant: "destructive",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send SOS",
        description: error.message || "Failed to send emergency alert.",
        variant: "destructive",
      });
    },
  });

  const resolveSOSMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'resolved' | 'false_alarm' }) => {
      if (!user?.id) throw new Error('No user');

      const { data, error } = await supabase
        .from('sos_alerts')
        .update({
          status,
          resolved_at: new Date().toISOString(),
          resolved_by: user.id,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sos-alerts', user?.id] });
      toast({
        title: "Alert Updated",
        description: `Alert has been marked as ${data.status}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Alert",
        description: error.message || "Failed to update alert status.",
        variant: "destructive",
      });
    },
  });

  const sendEmergencyAlert = () => {
    sendSOSMutation.mutate({
      alert_type: 'emergency',
      message: 'Emergency SOS alert triggered',
    });
  };

  const sendMedicalAlert = (message?: string) => {
    sendSOSMutation.mutate({
      alert_type: 'medical',
      message: message || 'Medical assistance required',
    });
  };

  const sendSecurityAlert = (message?: string) => {
    sendSOSMutation.mutate({
      alert_type: 'security',
      message: message || 'Security assistance required',
    });
  };

  return {
    sendSOS: sendSOSMutation.mutate,
    resolveSOS: resolveSOSMutation.mutate,
    sendEmergencyAlert,
    sendMedicalAlert,
    sendSecurityAlert,
    isSending: sendSOSMutation.isPending,
    isResolving: resolveSOSMutation.isPending,
  };
};