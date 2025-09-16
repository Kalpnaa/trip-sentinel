import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Plus, Trash2, Phone, User, Globe, Bell, Shield, LogOut } from "lucide-react";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface UserSettings {
  language: string;
  notifications: boolean;
  locationSharing: boolean;
  emergencyContacts: EmergencyContact[];
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' }
];

export const Settings = ({ currentUser }: { currentUser?: { name?: string; email?: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    notifications: true,
    locationSharing: true,
    emergencyContacts: []
  });
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  const { toast } = useToast();

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('tourist-safety-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('tourist-safety-settings', JSON.stringify(newSettings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };

    const updatedSettings = {
      ...settings,
      emergencyContacts: [...settings.emergencyContacts, contact]
    };

    saveSettings(updatedSettings);
    setNewContact({ name: '', phone: '', relationship: '' });
  };

  const removeEmergencyContact = (contactId: string) => {
    const updatedSettings = {
      ...settings,
      emergencyContacts: settings.emergencyContacts.filter(contact => contact.id !== contactId)
    };
    saveSettings(updatedSettings);
  };

  const updateSetting = (key: keyof UserSettings, value: any) => {
    const updatedSettings = { ...settings, [key]: value };
    saveSettings(updatedSettings);
  };

  const handleLogout = () => {
    // Clear settings and reload page
    localStorage.removeItem('tourist-safety-settings');
    window.location.reload();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="sm">
          <SettingsIcon className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Settings
          </SheetTitle>
          <SheetDescription>
            Manage your safety preferences and emergency contacts
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Account Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Account
            </h3>
            <Card className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Logged in as:</p>
                <p className="font-medium">{currentUser?.email || 'No user logged in'}</p>
                {currentUser?.email && (
                  <Badge variant="outline" className="text-safe-zone border-safe-zone">
                    Verified Tourist
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          <Separator />

          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Language & Region
            </h3>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => updateSetting('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Privacy & Safety */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Safety
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive safety alerts and updates
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSetting('notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share location with emergency contacts
                  </p>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => updateSetting('locationSharing', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Contacts
            </h3>
            
            {/* Existing Contacts */}
            <div className="space-y-3">
              {settings.emergencyContacts.map((contact) => (
                <Card key={contact.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmergencyContact(contact.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Add New Contact */}
            <Card className="p-4">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Emergency Contact
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="John Doe"
                      value={newContact.name}
                      onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Phone *</Label>
                    <Input
                      id="contact-phone"
                      placeholder="+1 234 567 8900"
                      value={newContact.phone}
                      onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-relationship">Relationship</Label>
                  <Select
                    value={newContact.relationship}
                    onValueChange={(value) => setNewContact({ ...newContact, relationship: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="spouse">Spouse/Partner</SelectItem>
                      <SelectItem value="parent">Parent/Guardian</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addEmergencyContact} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              </div>
            </Card>
          </div>

          <Separator />

          {/* Logout */}
          <div className="space-y-4">
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
