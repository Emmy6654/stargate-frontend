'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { KYCWizard } from '@/components/kyc/KYCWizard';
import { KYCStatusDisplay } from '@/components/kyc/KYCStatusDisplay';
import { KYCSubmission } from '@/types';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function KYCPage() {
  const [submission, setSubmission] = useState<KYCSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmission = async () => {
      try {
        const data = await api.kyc.getSubmission();
        setSubmission(data);
      } catch (err) {
        // Submission doesn't exist yet, which is fine
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };

    loadSubmission();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-ink mb-2">KYC Verification</h1>
        <p className="text-slate-600">Complete your Know Your Customer verification to unlock higher transaction limits and features.</p>
      </div>

      {/* Status Card */}
      {submission && <KYCStatusDisplay submission={submission} />}

      {/* KYC Wizard or Status */}
      <Card className="p-6">
        {submission?.status === 'approved' ? (
          <div className="text-center space-y-3">
            <div className="text-5xl">✓</div>
            <h2 className="text-2xl font-semibold text-ink">Verification Complete</h2>
            <p className="text-slate-600">Your account has been fully verified. You now have access to all features and higher transaction limits.</p>
          </div>
        ) : submission?.status === 'rejected' ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">Submission Rejected</h2>
              <p className="text-red-700 mb-4">{submission.rejection_reason || 'Your submission did not meet our verification requirements.'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink mb-3">Please resubmit with the following:</h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600">
                <li>Clear, unobstructed photos of all required documents</li>
                <li>Ensure all text is legible and not blurred</li>
                <li>Document must be valid and not expired</li>
                <li>All corners of the document must be visible</li>
              </ul>
            </div>
            <KYCWizard submission={submission} />
          </div>
        ) : (
          <KYCWizard submission={submission} />
        )}
      </Card>

      {/* Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-3">What Documents Are Needed?</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Valid government-issued identification</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Proof of business registration (if applicable)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Clear, legible photos or scans</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Documents must not be expired</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-ink mb-3">Why KYC is Required</h3>
          <p className="text-sm text-slate-600 mb-3">KYC (Know Your Customer) verification is required to:</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Comply with financial regulations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Enhance account security</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Prevent fraud and money laundering</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet font-bold">•</span>
              <span>Enable higher transaction limits</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
