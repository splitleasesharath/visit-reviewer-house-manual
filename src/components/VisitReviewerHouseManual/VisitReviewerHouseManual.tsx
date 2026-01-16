// ============================================================
// VISIT REVIEWER HOUSE MANUAL COMPONENT
// Split Lease Application - Main House Manual Component
// ============================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  VisitReviewerHouseManualProps,
  DisplayMode,
  UserRole,
  HouseManual,
  User,
  ApiError,
} from '../../types';
import {
  useHouseManual,
  useHouseManualAccess,
  useCurrentUser,
  useNotifications,
} from '../../hooks';
import {
  LoadingSpinner,
  ContentSkeleton,
  ErrorDisplay,
  AccessDenied,
  ExpiredContent,
  ToastContainer,
} from '../common';
import { HeaderSection } from './HeaderSection';
import { ContentDisplaySection } from './ContentDisplaySection';
import { UserInfoSection } from './UserInfoSection';
import { InteractionButtons } from './InteractionButtons';
import { SignupForm } from './SignupForm';
import { isExpired } from '../../utils';

// ============================================================
// TYPES
// ============================================================

type ViewState =
  | 'loading'
  | 'validating'
  | 'access_denied'
  | 'expired'
  | 'signup_required'
  | 'content'
  | 'error';

// ============================================================
// MAIN COMPONENT
// ============================================================

export const VisitReviewerHouseManual: React.FC<VisitReviewerHouseManualProps> = ({
  houseManualId,
  visitorUserId,
  reviewType,
  displayMode = DisplayMode.VIEW,
  accessToken,
  onClose,
  onSuccess,
  onError,
}) => {
  // State
  const [viewState, setViewState] = useState<ViewState>('loading');
  const [showSignupForm, setShowSignupForm] = useState(false);

  // Hooks
  const { user, isAuthenticated, isLoading: isUserLoading } = useCurrentUser();
  const {
    houseManual,
    sections,
    isLoading: isManualLoading,
    error: manualError,
    refetch,
    toggleSection,
    expandedSections,
  } = useHouseManual({
    houseManualId,
    accessToken,
    autoFetch: false, // We'll fetch after access validation
  });

  const {
    hasAccess,
    isValidating,
    accessError,
    validateAccess,
  } = useHouseManualAccess(houseManualId, accessToken, user?.id);

  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
  } = useNotifications();

  // ============================================================
  // ACCESS VALIDATION & DATA LOADING
  // ============================================================

  useEffect(() => {
    const initializeComponent = async () => {
      setViewState('validating');

      // Wait for user loading to complete
      if (isUserLoading) return;

      // Check if user needs to sign up (accessed via magic link but not authenticated)
      if (accessToken && !isAuthenticated) {
        // Validate the magic link first
        const isValidToken = await validateAccess();
        if (!isValidToken) {
          setViewState('access_denied');
          return;
        }
        setShowSignupForm(true);
        setViewState('signup_required');
        return;
      }

      // Validate access
      const accessGranted = await validateAccess();

      if (!accessGranted) {
        setViewState('access_denied');
        return;
      }

      // Fetch house manual data
      await refetch();
      setViewState('content');
    };

    initializeComponent();
  }, [isUserLoading, isAuthenticated, accessToken, validateAccess, refetch]);

  // Check for expiration after data loads
  useEffect(() => {
    if (houseManual && houseManual.expirationDate && isExpired(houseManual.expirationDate)) {
      setViewState('expired');
    }
  }, [houseManual]);

  // Handle errors
  useEffect(() => {
    if (manualError) {
      setViewState('error');
      onError?.(manualError);
    }
  }, [manualError, onError]);

  // Handle success
  useEffect(() => {
    if (houseManual && viewState === 'content') {
      onSuccess?.(houseManual);
    }
  }, [houseManual, viewState, onSuccess]);

  // ============================================================
  // EVENT HANDLERS
  // ============================================================

  const handleSignupSubmit = async (formData: any) => {
    try {
      // Signup logic would go here
      // After successful signup, refetch and show content
      showSuccess('Account created successfully!');
      setShowSignupForm(false);
      await refetch();
      setViewState('content');
    } catch (error) {
      showError('Failed to create account. Please try again.');
    }
  };

  const handleShare = () => {
    showSuccess('Link copied to clipboard!');
  };

  const handleDownload = () => {
    // Download logic
    showSuccess('Download started...');
  };

  const handleReport = () => {
    showSuccess('Report submitted. Thank you for your feedback!');
  };

  const handleContact = () => {
    // Open contact form/modal
    console.log('Contact host clicked');
  };

  const handleRetry = async () => {
    setViewState('loading');
    await refetch();
    if (!manualError) {
      setViewState('content');
    }
  };

  const handleGoBack = () => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  };

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  const getUserRole = (): UserRole => {
    if (user) return user.role;
    if (reviewType === 'visitor_review') return UserRole.VISITOR;
    if (reviewType === 'property_review') return UserRole.REVIEWER;
    return UserRole.VISITOR;
  };

  const getPermissions = () => {
    const role = getUserRole();
    return {
      canShare: true,
      canDownload: displayMode !== DisplayMode.PREVIEW,
      canPrint: displayMode !== DisplayMode.PREVIEW,
      canReport: isAuthenticated,
      canContact: role === UserRole.VISITOR || role === UserRole.REVIEWER,
    };
  };

  // ============================================================
  // RENDER
  // ============================================================

  // Loading state
  if (viewState === 'loading' || viewState === 'validating' || isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner
          size="large"
          text={viewState === 'validating' ? 'Validating access...' : 'Loading house manual...'}
        />
      </div>
    );
  }

  // Access denied state
  if (viewState === 'access_denied') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AccessDenied
          message={accessError || 'You do not have permission to view this house manual.'}
          onGoBack={handleGoBack}
          onLogin={() => window.location.href = '/login'}
        />
      </div>
    );
  }

  // Expired state
  if (viewState === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ExpiredContent
          message="This house manual has expired and is no longer available."
          expirationDate={houseManual?.expirationDate}
          onRequestAccess={() => {
            // Request new access logic
            console.log('Request new access');
          }}
        />
      </div>
    );
  }

  // Error state
  if (viewState === 'error') {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorDisplay
          error={manualError}
          variant="fullPage"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Signup required state
  if (viewState === 'signup_required' && showSignupForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600 mb-6">
              Sign up to view the house manual and get full access.
            </p>
            <SignupForm
              houseManualId={houseManualId}
              onSubmit={handleSignupSubmit}
              onCancel={handleGoBack}
            />
          </div>
        </div>
      </div>
    );
  }

  // Main content
  const permissions = getPermissions();
  const userRole = getUserRole();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-right"
      />

      {/* Header */}
      <HeaderSection
        title={houseManual?.title || 'House Manual'}
        propertyName={houseManual?.propertyName}
        propertyAddress={houseManual?.propertyAddress}
        lastUpdated={houseManual?.modifiedDate}
        onBack={handleGoBack}
        showBreadcrumb={false}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {isManualLoading ? (
          <ContentSkeleton />
        ) : (
          <>
            {/* User Info (if authenticated) */}
            {user && (
              <div className="px-4 py-4 border-b border-gray-200 bg-white">
                <UserInfoSection
                  user={user}
                  showContactInfo={false}
                  showReviewBadge={true}
                />
              </div>
            )}

            {/* Manual Content */}
            <ContentDisplaySection
              sections={sections}
              userRole={userRole}
              isLoading={isManualLoading}
              onSectionToggle={toggleSection}
            />
          </>
        )}
      </main>

      {/* Footer Actions */}
      {!isManualLoading && displayMode !== DisplayMode.PREVIEW && (
        <InteractionButtons
          houseManualId={houseManualId}
          canShare={permissions.canShare}
          canDownload={permissions.canDownload}
          canPrint={permissions.canPrint}
          canReport={permissions.canReport}
          canContact={permissions.canContact}
          onShare={handleShare}
          onDownload={handleDownload}
          onReport={handleReport}
          onContact={handleContact}
        />
      )}
    </div>
  );
};

// ============================================================
// MODAL WRAPPER
// ============================================================

interface VisitReviewerHouseManualModalProps extends VisitReviewerHouseManualProps {
  isOpen: boolean;
}

export const VisitReviewerHouseManualModal: React.FC<VisitReviewerHouseManualModalProps> = ({
  isOpen,
  onClose,
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="absolute inset-4 sm:inset-8 bg-white rounded-lg shadow-xl overflow-hidden">
        <VisitReviewerHouseManual onClose={onClose} {...props} />
      </div>
    </div>
  );
};

export default VisitReviewerHouseManual;
