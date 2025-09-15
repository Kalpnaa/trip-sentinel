import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Shield, Calendar, MapPin, Phone, Verified } from "lucide-react";

interface DigitalIDProps {
  user?: {
    name: string;
    email: string;
    phone: string;
    nationality: string;
    avatar?: string;
    idNumber: string;
    issuedDate: string;
    expiryDate: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relation: string;
    };
  };
}

export const DigitalID = ({ user }: DigitalIDProps) => {
  // Mock user data if not provided
  const mockUser = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 234 567 8900",
    nationality: "United States",
    avatar: undefined,
    idNumber: "TID-2024-001234",
    issuedDate: "2024-01-15",
    expiryDate: "2025-01-15",
    emergencyContact: {
      name: "Sarah Johnson",
      phone: "+1 234 567 8901",
      relation: "Spouse"
    }
  };

  const currentUser = user || mockUser;

  const verifyIdentity = () => {
    // TODO: Implement blockchain verification
    // - Connect to Hyperledger/Ethereum private chain
    // - Verify digital signature
    // - Check against trusted issuer
    console.log("Verifying digital identity...");
  };

  return (
    <div className="space-y-4">
      {/* ID Card */}
      <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 border-2 border-primary-foreground">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{currentUser.name}</h3>
              <p className="text-primary-foreground/80">{currentUser.nationality}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
            <Verified className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-primary-foreground/80">ID Number:</span>
            <span className="font-mono">{currentUser.idNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-foreground/80">Issued:</span>
            <span>{new Date(currentUser.issuedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-foreground/80">Expires:</span>
            <span>{new Date(currentUser.expiryDate).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      <Card className="p-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <User className="w-4 h-4" />
          Contact Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{currentUser.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{currentUser.email}</span>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      {currentUser.emergencyContact && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Emergency Contact
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{currentUser.emergencyContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Relation:</span>
              <span>{currentUser.emergencyContact.relation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-mono">{currentUser.emergencyContact.phone}</span>
            </div>
          </div>
        </Card>
      )}

      <Button onClick={verifyIdentity} className="w-full" variant="outline">
        <Shield className="w-4 h-4 mr-2" />
        Verify Identity on Blockchain
      </Button>
    </div>
  );
};