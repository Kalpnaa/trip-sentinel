import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { DocumentUpload } from './DocumentUpload';
import { useKYC, useDigitalTripIDs } from '@/hooks/useKYC';
import { useTrips } from '@/hooks/useTrips';
import { useProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, CheckCircle, Clock, AlertCircle, QrCode, Calendar, MapPin } from 'lucide-react';

export const BlockchainVerification = () => {
  const { kycData, verifyKYC, isVerifying } = useKYC();
  const { digitalTripIDs } = useDigitalTripIDs();
  const { trips } = useTrips();
  const { profile } = useProfile();
  const { t } = useLanguage();
  const [selectedTripId, setSelectedTripId] = useState('');
  const [verificationStep, setVerificationStep] = useState(0);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  // Filter active/planned trips
  const eligibleTrips = trips.filter(trip => 
    trip.status === 'planned' || trip.status === 'active'
  );

  const handleDocumentUpload = (uploadedKycData: any) => {
    setVerificationStep(1);
  };

  const handleVerifyIdentity = () => {
    if (!kycData?.id || !selectedTripId) return;
    
    setVerificationStep(2);
    verifyKYC({ kycId: kycData.id, tripId: selectedTripId });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-safe-zone" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning-zone" />;
      default:
        return <AlertCircle className="w-4 h-4 text-danger-zone" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-safe-zone/10 text-safe-zone border-safe-zone';
      case 'pending':
        return 'bg-warning-zone/10 text-warning-zone border-warning-zone';
      default:
        return 'bg-danger-zone/10 text-danger-zone border-danger-zone';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current KYC Status */}
      {kycData && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('identityVerificationStatus')}
            </h3>
            <Badge className={getStatusColor(kycData.status)}>
              {getStatusIcon(kycData.status)}
              {kycData.status.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t('documentType')}</p>
                <p className="font-medium">{kycData.id_type.replace('_', ' ').toUpperCase()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('documentNumber')}</p>
                <p className="font-mono">{kycData.id_number}</p>
              </div>
          </div>

          {kycData.blockchain_tx_hash && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">{t('blockchainTransaction')}</p>
              <p className="font-mono text-xs break-all">{kycData.blockchain_tx_hash}</p>
            </div>
          )}
        </Card>
      )}

      {/* Digital Trip IDs */}
      {digitalTripIDs.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <QrCode className="w-5 h-5" />
            {t('yourDigitalTravelIds')}
          </h3>
          
          <div className="space-y-3">
            {digitalTripIDs.map((digitalId: any) => (
              <div key={digitalId.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{digitalId.trips?.title}</h4>
                  <Badge variant="outline">
                    {digitalId.digital_id_number}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{digitalId.trips?.destination}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(digitalId.issued_date).toLocaleDateString()} - 
                      {new Date(digitalId.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {digitalId.qr_code_url && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => { setQrUrl(digitalId.qr_code_url); setQrOpen(true); }}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    {t('viewQrCode')}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Verification Process */}
      {!kycData && (
        <DocumentUpload onUploadComplete={handleDocumentUpload} />
      )}

      {kycData && kycData.status === 'pending' && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Create Digital Travel ID</h3>
          
          {eligibleTrips.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-medium mb-2">No Trips Available</h4>
              <p className="text-sm text-muted-foreground mb-4">
                You need to create a trip first to generate a digital travel ID.
              </p>
              <Button 
                onClick={() => {
                  // Use the proper tab navigation system
                  const event = new CustomEvent('navigate-to-tab', { detail: 'itinerary' });
                  window.dispatchEvent(event);
                }}
                variant="outline"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Create a Trip
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Select Trip for Digital ID
                </label>
                <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleTrips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.title} - {trip.destination} 
                        ({new Date(trip.start_date).toLocaleDateString()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {verificationStep === 2 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Progress</label>
                  <Progress value={isVerifying ? 50 : 100} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {isVerifying ? 'Verifying on blockchain...' : 'Verification complete'}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleVerifyIdentity}
                disabled={!selectedTripId || isVerifying}
                className="w-full"
              >
                {isVerifying ? (
                  <>Verifying on Blockchain...</>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Identity & Create Digital ID
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      )}

      {kycData && kycData.status === 'verified' && (
        <Card className="p-4 bg-safe-zone/5 border-safe-zone">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-safe-zone mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-safe-zone mb-2">
              Identity Verified Successfully
            </h3>
            <p className="text-sm text-muted-foreground">
              Your identity has been verified and stored on the blockchain. 
              You can now create digital travel IDs for your trips.
            </p>
          </div>
        </Card>
      )}

      {/* QR Dialog */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Digital Travel ID QR</DialogTitle>
            <DialogDescription>Scan to verify your travel ID</DialogDescription>
          </DialogHeader>
          {qrUrl && (
            <div className="flex flex-col items-center gap-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrUrl)}`}
                alt="Digital travel ID QR code"
                loading="lazy"
                className="rounded-md"
              />
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <a href={qrUrl} target="_blank" rel="noopener noreferrer">Open link</a>
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    try { if (qrUrl) await navigator.clipboard.writeText(qrUrl); } catch {}
                  }}
                >
                  Copy link
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};