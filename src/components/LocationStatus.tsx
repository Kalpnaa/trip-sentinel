import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, WifiOff, Shield } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
}

interface LocationStatusProps {
  onLocationUpdate?: (location: LocationData) => void;
}

export const LocationStatus = ({ onLocationUpdate }: LocationStatusProps) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [safetyStatus, setSafetyStatus] = useState<"safe" | "warning" | "danger">("safe");

  useEffect(() => {
    // Track online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get location updates
    const watchId = navigator.geolocation?.watchPosition(
      (position) => {
        const newLocation: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };
        
        setLocation(newLocation);
        onLocationUpdate?.(newLocation);
        
        // TODO: Check geo-fencing rules
        // Simulate safety status based on location
        checkSafetyZone(newLocation);
      },
      (error) => {
        console.error("Location error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [onLocationUpdate]);

  const checkSafetyZone = (loc: LocationData) => {
    // TODO: Implement actual geo-fencing logic
    // For now, simulate based on coordinates
    const randomSafety = Math.random();
    if (randomSafety > 0.8) {
      setSafetyStatus("warning");
    } else if (randomSafety > 0.95) {
      setSafetyStatus("danger");
    } else {
      setSafetyStatus("safe");
    }
  };

  const getSafetyColor = () => {
    switch (safetyStatus) {
      case "safe": return "bg-safe-zone";
      case "warning": return "bg-warning-zone";
      case "danger": return "bg-danger-zone";
      default: return "bg-muted";
    }
  };

  const getSafetyText = () => {
    switch (safetyStatus) {
      case "safe": return "Safe Zone";
      case "warning": return "Caution Area";
      case "danger": return "High Risk Zone";
      default: return "Unknown";
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Location Status
        </h3>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-safe-zone" />
          ) : (
            <WifiOff className="w-4 h-4 text-muted-foreground" />
          )}
          <Badge className={getSafetyColor()}>
            <Shield className="w-3 h-3" />
            {getSafetyText()}
          </Badge>
        </div>
      </div>

      {location ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Coordinates:</span>
            <span className="font-mono">
              {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Accuracy:</span>
            <span>{Math.round(location.accuracy)}m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Update:</span>
            <span>{location.timestamp.toLocaleTimeString()}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          Getting your location...
        </div>
      )}
    </Card>
  );
};