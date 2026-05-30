'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { KYCDocumentType, KYCSubmission } from '@/types';
import { api } from '@/lib/api';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const DOCUMENT_TYPES: { value: KYCDocumentType; label: string; description: string }[] = [
  { value: 'passport', label: 'Passport', description: 'Valid international passport' },
  { value: 'drivers_license', label: "Driver's License", description: 'Government-issued driver license' },
  { value: 'national_id', label: 'National ID', description: 'Government-issued national identification' },
  { value: 'business_license', label: 'Business License', description: 'Business registration or license document' },
];

type Step = 'type' | 'upload' | 'review' | 'success';

const STEP_ORDER: Step[] = ['type', 'upload', 'review', 'success'];
const stepIndex = (s: Step) => STEP_ORDER.indexOf(s);

interface UploadedDoc {
  file: File;
  documentType: KYCDocumentType;
  id?: string;
}

export function KYCWizard({ submission }: { submission?: KYCSubmission }) {
  const [step, setStep] = useState<Step>('type');
  const [selectedType, setSelectedType] = useState<KYCDocumentType | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>(
    submission?.documents?.map((doc) => ({ file: new File([], doc.file_name), documentType: doc.document_type, id: doc.id })) || []
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!selectedType) return;
    if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
      setError('Please upload an image or PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const result = await api.kyc.uploadDocument(selectedType, file);
      setUploadedDocs((prev) => [...prev, { file, documentType: selectedType, id: result.id }]);
      setSelectedType(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveDoc = async (index: number) => {
    const doc = uploadedDocs[index];
    if (doc.id) {
      try {
        await api.kyc.removeDocument(doc.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove document');
        return;
      }
    }
    setUploadedDocs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedDocs.length === 0) {
      setError('Please upload at least one document');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const docIds = uploadedDocs.filter((doc) => doc.id).map((doc) => doc.id!);
      await api.kyc.submitKYC(docIds);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit KYC');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-16 h-16 text-mint mx-auto" />
          <h2 className="text-2xl font-semibold text-ink">KYC Submitted Successfully</h2>
          <p className="text-slate-600">Your documents have been submitted for review. We'll notify you once the verification is complete.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex gap-2">
        {(['type', 'upload', 'review'] as const).map((s, idx) => (
          <div key={s} className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                step === s ? 'bg-violet text-white' : stepIndex(step) > stepIndex(s) ? 'bg-mint text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {idx + 1}
            </div>
            {idx < 2 && <div className={`h-1 w-8 mx-1 transition ${stepIndex(step) > stepIndex(s) ? 'bg-mint' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Document Type Selection */}
      {step === 'type' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Step 1: Select Document Type</h2>
            <p className="text-slate-600 text-sm mb-6">Choose the type of document you want to upload for verification.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DOCUMENT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setSelectedType(type.value);
                  setStep('upload');
                }}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedType === type.value
                    ? 'border-violet bg-violet/5'
                    : 'border-slate-200 bg-white hover:border-violet/30 hover:bg-slate-50'
                }`}
              >
                <h3 className="font-semibold text-ink">{type.label}</h3>
                <p className="text-sm text-slate-600">{type.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: File Upload */}
      {step === 'upload' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Step 2: Upload Document</h2>
            <p className="text-slate-600 text-sm mb-6">
              Upload a clear image or PDF of your {DOCUMENT_TYPES.find((t) => t.value === selectedType)?.label.toLowerCase()}. File size must be less than 10MB.
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-violet/50 transition">
            <input
              type="file"
              id="fileInput"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              disabled={uploading}
              accept="image/*,.pdf"
              className="hidden"
            />
            <label htmlFor="fileInput" className="cursor-pointer block">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 text-violet mx-auto mb-2 animate-spin" />
                  <p className="text-slate-600">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-ink font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-600">PNG, JPG, GIF or PDF up to 10MB</p>
                </>
              )}
            </label>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('type')} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep('review')} disabled={uploadedDocs.length === 0} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 'review' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-ink mb-2">Step 3: Review & Submit</h2>
            <p className="text-slate-600 text-sm mb-6">Review your uploaded documents before submitting for verification.</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-ink">Uploaded Documents ({uploadedDocs.length})</h3>
            {uploadedDocs.map((doc, idx) => (
              <div key={idx} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center flex-shrink-0">
                    <Upload size={20} className="text-slate-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">{doc.file.name}</p>
                    <p className="text-sm text-slate-600">
                      {DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label} • {(doc.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveDoc(idx)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
            <p className="font-medium mb-1">Privacy & Security</p>
            <p>Your documents are encrypted and securely processed. We comply with all data protection regulations.</p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('type')} disabled={submitting} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || uploadedDocs.length === 0} className="flex-1">
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting...
                </>
              ) : (
                'Submit KYC'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
