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
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-semibold mb-2">No Digital ID Available</h3>
        <p className="text-muted-foreground mb-4">
          Please log in to view your digital identification.
        </p>
      </Card>
    );
  }

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
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-lg">{user.name}</h3>
              <p className="text-primary-foreground/80">{user.nationality}</p>
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
            <span className="font-mono">{user.idNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-foreground/80">Issued:</span>
            <span>{new Date(user.issuedDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-primary-foreground/80">Expires:</span>
            <span>{new Date(user.expiryDate).toLocaleDateString()}</span>
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
            <span>{user.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
        </div>
      </Card>

      {/* Emergency Contact */}
      {user.emergencyContact && (
        <Card className="p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Emergency Contact
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span>{user.emergencyContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Relation:</span>
              <span>{user.emergencyContact.relation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-mono">{user.emergencyContact.phone}</span>
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