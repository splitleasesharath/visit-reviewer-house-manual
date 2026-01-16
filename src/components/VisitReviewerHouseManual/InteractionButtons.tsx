// ============================================================
// INTERACTION BUTTONS COMPONENT
// Split Lease Application - House Manual Action Buttons
// ============================================================

import React, { useState } from 'react';
import { InteractionButtonsProps } from '../../types';
import { Button, IconButton, Modal } from '../common';

// ============================================================
// ICONS
// ============================================================

const ShareIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const PrintIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const ReportIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

const ContactIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const SmsIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const QrCodeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="3" height="3" />
    <rect x="18" y="14" width="3" height="3" />
    <rect x="14" y="18" width="3" height="3" />
    <rect x="18" y="18" width="3" height="3" />
  </svg>
);

// ============================================================
// SHARE MODAL COMPONENT
// ============================================================

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (method: 'copy' | 'email' | 'sms' | 'qr', data?: { email?: string; phone?: string }) => void;
  isLoading?: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare, isLoading = false }) => {
  const [shareMethod, setShareMethod] = useState<'copy' | 'email' | 'sms' | 'qr' | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleShare = () => {
    if (!shareMethod) return;

    if (shareMethod === 'email') {
      onShare('email', { email });
    } else if (shareMethod === 'sms') {
      onShare('sms', { phone });
    } else {
      onShare(shareMethod);
    }
  };

  const shareOptions = [
    { id: 'copy' as const, icon: <CopyIcon className="h-5 w-5" />, label: 'Copy Link' },
    { id: 'email' as const, icon: <EmailIcon className="h-5 w-5" />, label: 'Send via Email' },
    { id: 'sms' as const, icon: <SmsIcon className="h-5 w-5" />, label: 'Send via SMS' },
    { id: 'qr' as const, icon: <QrCodeIcon className="h-5 w-5" />, label: 'QR Code' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share House Manual"
      size="small"
    >
      <div className="space-y-4">
        {/* Share Method Selection */}
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setShareMethod(option.id)}
              className={`
                flex flex-col items-center gap-2 p-4
                border-2 rounded-lg transition-colors
                ${shareMethod === option.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }
              `}
            >
              {option.icon}
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        {/* Email Input */}
        {shareMethod === 'email' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
            />
          </div>
        )}

        {/* Phone Input */}
        {shareMethod === 'sms' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="
                w-full px-3 py-2
                border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleShare}
            disabled={!shareMethod || (shareMethod === 'email' && !email) || (shareMethod === 'sms' && !phone)}
            isLoading={isLoading}
            fullWidth
          >
            Share
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// REPORT ISSUE MODAL COMPONENT
// ============================================================

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueType: string, description: string) => void;
  isLoading?: boolean;
}

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  const issueTypes = [
    'Incorrect Information',
    'Missing Content',
    'Outdated Information',
    'Broken Links/Images',
    'Other',
  ];

  const handleSubmit = () => {
    if (issueType && description) {
      onSubmit(issueType, description);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report an Issue"
      size="medium"
    >
      <div className="space-y-4">
        {/* Issue Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Type
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="
              w-full px-3 py-2
              border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            "
          >
            <option value="">Select an issue type</option>
            {issueTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the issue in detail..."
            rows={4}
            className="
              w-full px-3 py-2
              border border-gray-300 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              resize-none
            "
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!issueType || !description}
            isLoading={isLoading}
            fullWidth
          >
            Submit Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================================
// INTERACTION BUTTONS COMPONENT
// ============================================================

export const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  houseManualId,
  canShare,
  canDownload,
  canPrint,
  canReport,
  canContact,
  onShare,
  onDownload,
  onPrint,
  onReport,
  onContact,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShare = async (
    method: 'copy' | 'email' | 'sms' | 'qr',
    _data?: { email?: string; phone?: string }
  ) => {
    setIsLoading(true);
    try {
      // Handle share based on method
      if (method === 'copy') {
        // Copy link to clipboard
        const shareUrl = `${window.location.origin}/manual/${houseManualId}`;
        await navigator.clipboard.writeText(shareUrl);
      }
      onShare?.();
      setIsShareModalOpen(false);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReport = async (issueType: string, description: string) => {
    setIsLoading(true);
    try {
      console.log('Report submitted:', { houseManualId, issueType, description });
      onReport?.();
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('Report failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
    onPrint?.();
  };

  return (
    <>
      {/* Button Container */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {/* Share Button */}
          {canShare && (
            <Button
              variant="outline"
              size="small"
              leftIcon={<ShareIcon className="h-4 w-4" />}
              onClick={() => setIsShareModalOpen(true)}
            >
              Share
            </Button>
          )}

          {/* Download Button */}
          {canDownload && (
            <Button
              variant="outline"
              size="small"
              leftIcon={<DownloadIcon className="h-4 w-4" />}
              onClick={onDownload}
            >
              Download
            </Button>
          )}

          {/* Print Button */}
          {canPrint && (
            <Button
              variant="outline"
              size="small"
              leftIcon={<PrintIcon className="h-4 w-4" />}
              onClick={handlePrint}
            >
              Print
            </Button>
          )}

          {/* Report Issue Button */}
          {canReport && (
            <Button
              variant="ghost"
              size="small"
              leftIcon={<ReportIcon className="h-4 w-4" />}
              onClick={() => setIsReportModalOpen(true)}
            >
              Report Issue
            </Button>
          )}

          {/* Contact Host Button */}
          {canContact && (
            <Button
              variant="primary"
              size="small"
              leftIcon={<ContactIcon className="h-4 w-4" />}
              onClick={onContact}
            >
              Contact Host
            </Button>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={handleShare}
        isLoading={isLoading}
      />

      {/* Report Issue Modal */}
      <ReportIssueModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
        isLoading={isLoading}
      />
    </>
  );
};

// ============================================================
// FLOATING ACTION BUTTON
// ============================================================

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon,
  label,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6
        w-14 h-14
        bg-blue-600 text-white
        rounded-full shadow-lg
        hover:bg-blue-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all
        flex items-center justify-center
      "
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default InteractionButtons;
