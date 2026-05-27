'use client';

import { KYCSubmission } from '@/types';
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';

export function KYCStatusDisplay({ submission }: { submission?: KYCSubmission }) {
  if (!submission) return null;

  const getStatusConfig = (status: KYCSubmission['status']) => {
    switch (status) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-mint', bgColor: 'bg-mint/10', label: 'Approved', description: 'Your KYC has been verified' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Rejected', description: submission.rejection_reason || 'Your submission was rejected' };
      case 'pending_review':
        return { icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Pending Review', description: 'Your documents are under review' };
      case 'submitted':
        return { icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Submitted', description: 'Your documents have been submitted' };
      default:
        return { icon: Clock, color: 'text-slate-600', bgColor: 'bg-slate-50', label: 'Draft', description: 'KYC in progress' };
    }
  };

  const config = getStatusConfig(submission.status);
  const Icon = config.icon;

  return (
    <div className={`p-4 ${config.bgColor} rounded-lg border border-slate-200`}>
      <div className="flex items-start gap-3">
        <Icon className={`${config.color} flex-shrink-0 mt-0.5`} size={20} />
        <div>
          <h3 className="font-semibold text-ink">{config.label}</h3>
          <p className="text-sm text-slate-600">{config.description}</p>
          {submission.submitted_at && (
            <p className="text-xs text-slate-500 mt-1">Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );
}
