import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Plus, Trash2, Edit } from "lucide-react";

interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  location: string;
  activity: string;
  description?: string;
  safety_notes?: string;
}

interface TripItineraryProps {
  onItineraryUpdate?: (itinerary: ItineraryItem[]) => void;
}

export const TripItinerary = ({ onItineraryUpdate }: TripItineraryProps) => {
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    {
      id: "1",
      day: 1,
      time: "09:00",
      location: "Times Square",
      activity: "Sightseeing",
      description: "Visit the iconic Times Square and take photos",
      safety_notes: "Stay in well-lit areas, avoid street vendors"
    },
    {
      id: "2", 
      day: 1,
      time: "14:00",
      location: "Central Park",
      activity: "Nature Walk",
      description: "Relaxing walk through Central Park",
      safety_notes: "Stay on main paths, travel in groups"
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ItineraryItem>>({
    day: 1,
    time: "",
    location: "",
    activity: "",
    description: "",
    safety_notes: ""
  });

  const addItineraryItem = () => {
    if (!newItem.time || !newItem.location || !newItem.activity) return;

    const item: ItineraryItem = {
      id: Date.now().toString(),
      day: newItem.day || 1,
      time: newItem.time!,
      location: newItem.location!,
      activity: newItem.activity!,
      description: newItem.description,
      safety_notes: newItem.safety_notes
    };

    const updatedItinerary = [...itinerary, item].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.time.localeCompare(b.time);
    });

    setItinerary(updatedItinerary);
    onItineraryUpdate?.(updatedItinerary);
    
    // Reset form
    setNewItem({
      day: 1,
      time: "",
      location: "",
      activity: "",
      description: "",
      safety_notes: ""
    });
    setIsEditing(false);
  };

  const removeItem = (id: string) => {
    const updatedItinerary = itinerary.filter(item => item.id !== id);
    setItinerary(updatedItinerary);
    onItineraryUpdate?.(updatedItinerary);
  };

  const groupedByDay = itinerary.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Trip Itinerary
        </h3>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Add New Item Form */}
      {isEditing && (
        <Card className="p-4">
          <h4 className="font-medium mb-3">Add New Activity</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-sm font-medium">Day</label>
              <Input
                type="number"
                min="1"
                value={newItem.day}
                onChange={(e) => setNewItem({...newItem, day: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time</label>
              <Input
                type="time"
                value={newItem.time}
                onChange={(e) => setNewItem({...newItem, time: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                placeholder="Enter location"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Activity</label>
              <Input
                placeholder="What will you do?"
                value={newItem.activity}
                onChange={(e) => setNewItem({...newItem, activity: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Additional details..."
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Safety Notes</label>
              <Textarea
                placeholder="Safety considerations..."
                value={newItem.safety_notes}
                onChange={(e) => setNewItem({...newItem, safety_notes: e.target.value})}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={addItineraryItem}>Add Activity</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Itinerary Items */}
      <div className="space-y-4">
        {Object.entries(groupedByDay).map(([day, items]) => (
          <div key={day}>
            <h4 className="font-medium text-primary mb-3">Day {day}</h4>
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{item.time}</span>
                        <Badge variant="outline">{item.activity}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.location}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                      )}
                      {item.safety_notes && (
                        <div className="bg-warning-zone/10 border border-warning-zone/20 rounded p-2 text-sm">
                          <span className="font-medium text-warning-zone">Safety Note: </span>
                          {item.safety_notes}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {itinerary.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No activities planned yet.</p>
          <p className="text-sm text-muted-foreground">Add your first activity to get started!</p>
        </Card>
      )}
    </div>
  );
};