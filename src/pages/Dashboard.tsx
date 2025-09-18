import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SOSButton } from "@/components/SOSButton";
import { LocationStatus } from "@/components/LocationStatus";
import { DigitalID } from "@/components/DigitalID";
import { TripItinerary } from "@/components/TripItinerary";
import { Settings } from "@/components/Settings";
import { BlockchainVerification } from "@/components/BlockchainVerification";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  MapPin, 
  Calendar, 
  User, 
  Settings as SettingsIcon, 
  AlertTriangle,
  Activity,
  Users,
  FileText
} from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  location: string;
  activity: string;
  description?: string;
  safety_notes?: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [safetyAlerts, setSafetyAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      // Fetch user trips
      const { data: tripsData } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setProfile(profileData);
      setTrips(tripsData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map profile data to DigitalID shape
  const userForID = profile
    ? {
        name: profile.full_name || user?.email,
        email: user?.email,
        phone: profile.phone_number,
        nationality: profile.nationality,
        avatar: profile.avatar_url,
        idNumber: `TID-${user?.id?.substring(0, 8) || "TEMP"}`,
        issuedDate: profile.created_at || new Date().toISOString(),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
        emergencyContact: {
          name: profile.emergency_contact_name,
          phone: profile.emergency_contact_phone,
          relation: "Emergency Contact"
        },
      }
    : undefined;

  const handleLocationUpdate = (location: LocationData) => {
    setCurrentLocation(location);
    // TODO: Send to backend API for geo-fencing checks
    console.log("Location updated:", location);
  };

  const handleSOSActivated = () => {
    // TODO: Implement SOS response
    // - Log incident in database
    // - Send notifications to emergency contacts
    // - Generate incident report
    console.log("SOS activated - emergency response initiated");
  };

  const handleItineraryUpdate = (newItinerary: ItineraryItem[]) => {
    setItinerary(newItinerary);
    // TODO: Save to backend
    console.log("Itinerary updated:", newItinerary);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-primary-foreground">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">Tourist Safety Monitor</h1>
            <p className="text-primary-foreground/80 text-sm">Stay safe, explore confidently</p>
          </div>
          <Settings currentUser={profile} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-card border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-3 text-center">
              <Shield className="w-6 h-6 text-safe-zone mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="font-semibold text-sm">Safe</p>
            </Card>
            <Card className="p-3 text-center">
              <Users className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Group</p>
              <p className="font-semibold text-sm">{profile ? '1 Member' : 'No Group'}</p>
            </Card>
            <Card className="p-3 text-center">
              <Activity className="w-6 h-6 text-secondary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="font-semibold text-sm">{itinerary.length} Activities</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <div className="space-y-2 mb-6">
            {safetyAlerts.map((alert) => (
              <Card key={alert.id} className="p-3 border-warning-zone bg-warning-zone/5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning-zone mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-warning-zone border-warning-zone">
                    {alert.severity}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* SOS Button - Always Visible */}
        <div className="text-center mb-6">
          <SOSButton onSOSActivated={handleSOSActivated} />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="location" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="location" className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger value="itinerary" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Itinerary</span>
            </TabsTrigger>
            <TabsTrigger value="id" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Digital ID</span>
            </TabsTrigger>
            <TabsTrigger value="verify" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Verify</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location">
            <LocationStatus onLocationUpdate={handleLocationUpdate} />
          </TabsContent>

          <TabsContent value="itinerary">
            <TripItinerary onItineraryUpdate={handleItineraryUpdate} />
          </TabsContent>

          <TabsContent value="id">
            <DigitalID user={userForID} />
          </TabsContent>

          <TabsContent value="verify">
            <BlockchainVerification />
          </TabsContent>

          <TabsContent value="reports">
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Incident Reports</h3>
              <p className="text-muted-foreground mb-4">
                No incidents reported. Generate E-FIR reports when needed.
              </p>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};