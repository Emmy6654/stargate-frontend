import { useEffect, useState } from 'react';
import { KYCSubmission } from '@/types';
import { api } from '@/lib/api';

export function useKYC() {
  const [submission, setSubmission] = useState<KYCSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSubmission = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.kyc.getSubmission();
      setSubmission(data);
    } catch (err) {
      setSubmission(null);
      // If 404 or similar, it's fine - KYC just doesn't exist yet
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubmission();
  }, []);

  return {
    submission,
    loading,
    error,
    refreshSubmission,
    isApproved: submission?.status === 'approved',
    isRejected: submission?.status === 'rejected',
    isPending: submission?.status === 'pending_review',
  };
}
