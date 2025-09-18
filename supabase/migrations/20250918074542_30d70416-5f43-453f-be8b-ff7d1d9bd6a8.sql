-- Create storage policies for KYC bucket to allow file uploads
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'kyc' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC documents" 
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'kyc'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own KYC documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'kyc'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own KYC documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'kyc'
  AND auth.uid()::text = (storage.foldername(name))[1]
);