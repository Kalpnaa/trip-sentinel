import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface TripCreatorProps {
  onTripCreated?: () => void;
}

export const TripCreator = ({ onTripCreated }: TripCreatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tripData, setTripData] = useState({
    title: '',
    destination: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: tripData.title,
          destination: tripData.destination,
          description: tripData.description,
          start_date: tripData.start_date,
          end_date: tripData.end_date,
          status: 'planned'
        });

      if (error) throw error;

      toast({
        title: "Trip Created Successfully",
        description: `${tripData.title} to ${tripData.destination} has been added to your trips.`,
      });

      // Reset form
      setTripData({
        title: '',
        destination: '',
        description: '',
        start_date: '',
        end_date: ''
      });
      setIsCreating(false);
      onTripCreated?.();

    } catch (error: any) {
      toast({
        title: "Failed to Create Trip",
        description: error.message || "Failed to create trip.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTripData({
      title: '',
      destination: '',
      description: '',
      start_date: '',
      end_date: ''
    });
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          My Trips
        </h3>
        <Button
          onClick={() => setIsCreating(!isCreating)}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Trip
        </Button>
      </div>

      {isCreating && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Create New Trip</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Trip Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Summer Vacation 2025"
                  value={tripData.title}
                  onChange={(e) => setTripData({ ...tripData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Paris, France"
                  value={tripData.destination}
                  onChange={(e) => setTripData({ ...tripData, destination: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={tripData.start_date}
                  onChange={(e) => setTripData({ ...tripData, start_date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={tripData.end_date}
                  onChange={(e) => setTripData({ ...tripData, end_date: e.target.value })}
                  required
                  min={tripData.start_date}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your trip..."
                value={tripData.description}
                onChange={(e) => setTripData({ ...tripData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Trip'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};