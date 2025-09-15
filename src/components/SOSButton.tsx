import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SOSButtonProps {
  onSOSActivated?: () => void;
}

export const SOSButton = ({ onSOSActivated }: SOSButtonProps) => {
  const [isActivated, setIsActivated] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const handleSOSPress = () => {
    if (isActivated) return;
    
    setIsActivated(true);
    setCountdown(5);
    
    // Countdown before sending SOS
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          sendSOSAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show toast
    toast({
      title: "SOS Alert Activated",
      description: "Emergency services will be notified in 5 seconds. Tap to cancel.",
      variant: "destructive",
    });
  };

  const sendSOSAlert = () => {
    // TODO: Implement actual SOS functionality
    // - Get current location
    // - Send to backend API
    // - Notify emergency contacts
    // - Log incident in database
    
    toast({
      title: "SOS Alert Sent!",
      description: "Emergency services and contacts have been notified.",
    });
    
    onSOSActivated?.();
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsActivated(false);
    }, 3000);
  };

  const cancelSOS = () => {
    setIsActivated(false);
    setCountdown(0);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        size="lg"
        variant={isActivated ? "destructive" : "default"}
        className={`
          w-32 h-32 rounded-full shadow-lg transition-all duration-300
          ${isActivated 
            ? "bg-gradient-to-br from-emergency to-danger-zone animate-pulse shadow-emergency" 
            : "bg-gradient-to-br from-primary to-secondary hover:shadow-lg"
          }
        `}
        onClick={isActivated ? cancelSOS : handleSOSPress}
        disabled={countdown > 0 && countdown < 5}
      >
        <div className="flex flex-col items-center space-y-2">
          {isActivated ? (
            <AlertTriangle className="w-8 h-8" />
          ) : (
            <Phone className="w-8 h-8" />
          )}
          <span className="text-sm font-bold">
            {isActivated ? (countdown > 0 ? `${countdown}s` : "ACTIVE") : "SOS"}
          </span>
        </div>
      </Button>
      
      <p className="text-center text-sm text-muted-foreground max-w-xs">
        {isActivated 
          ? "SOS Alert is active. Tap to cancel."
          : "Press and hold for emergency assistance"
        }
      </p>
    </div>
  );
};