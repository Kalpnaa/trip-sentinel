import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, Camera, FileText, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  onUploadComplete?: (kycData: any) => void;
}

export const DocumentUpload = ({ onUploadComplete }: DocumentUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [idType, setIdType] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);

  const handleFileUpload = async (file: File, fileName: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${fileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('kyc').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !idDocument || !selfiePhoto || !idType || !idNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields and upload both documents.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload ID document
      setUploadProgress(25);
      const idDocumentUrl = await handleFileUpload(idDocument, `id_document_${Date.now()}`);
      
      if (!idDocumentUrl) {
        throw new Error('Failed to upload ID document');
      }

      // Upload selfie
      setUploadProgress(50);
      const selfieUrl = await handleFileUpload(selfiePhoto, `selfie_${Date.now()}`);
      
      if (!selfieUrl) {
        throw new Error('Failed to upload selfie');
      }

      // Store KYC data in database
      setUploadProgress(75);
      const { data: kycData, error } = await supabase
        .from('kyc' as any)
        .insert({
          user_id: user.id,
          id_type: idType,
          id_number: idNumber,
          image_url: idDocumentUrl,
          selfie_url: selfieUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(100);
      
      toast({
        title: "Documents Uploaded",
        description: "Your documents have been uploaded successfully.",
      });

      onUploadComplete?.(kycData);
      
      // Reset form
      setIdType('');
      setIdNumber('');
      setIdDocument(null);
      setSelfiePhoto(null);

    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload documents.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Document Verification</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="idType">Document Type</Label>
          <Select value={idType} onValueChange={setIdType}>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="passport">Passport</SelectItem>
              <SelectItem value="national_id">National ID</SelectItem>
              <SelectItem value="drivers_license">Driver's License</SelectItem>
              <SelectItem value="voter_id">Voter ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber">Document Number</Label>
          <Input
            id="idNumber"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="Enter document number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idDocument">ID Document Photo</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <Input
              id="idDocument"
              type="file"
              accept="image/*"
              onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="idDocument" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {idDocument ? idDocument.name : 'Click to upload ID document'}
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="selfie">Selfie Photo</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <Input
              id="selfie"
              type="file"
              accept="image/*"
              onChange={(e) => setSelfiePhoto(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="selfie" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Camera className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {selfiePhoto ? selfiePhoto.name : 'Click to take/upload selfie'}
                </p>
              </div>
            </label>
          </div>
        </div>

        {uploading && (
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
          </div>
        )}

        <Button type="submit" disabled={uploading} className="w-full">
          {uploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};