-- Enable RLS on KYC and digital_trip_ids tables
ALTER TABLE public.kyc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_trip_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for kyc table
CREATE POLICY "Users can view their own KYC data"
ON public.kyc
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC data"
ON public.kyc
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own KYC data"
ON public.kyc
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for digital_trip_ids table
CREATE POLICY "Users can view their own digital trip IDs"
ON public.digital_trip_ids
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own digital trip IDs"
ON public.digital_trip_ids
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for kyc_requests table
CREATE POLICY "Users can view their own KYC requests"
ON public.kyc_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own KYC requests"
ON public.kyc_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);