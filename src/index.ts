// ============================================================
// SPLIT LEASE - VISIT REVIEWER HOUSE MANUAL
// Main Entry Point
// ============================================================

// Components
export {
  VisitReviewerHouseManual,
  VisitReviewerHouseManualModal,
  HeaderSection,
  CompactHeader,
  ContentDisplaySection,
  UserInfoSection,
  CompactUserCard,
  InteractionButtons,
  FloatingActionButton,
  SignupForm,
} from './components/VisitReviewerHouseManual';

// Common Components
export {
  LoadingSpinner,
  Skeleton,
  ContentSkeleton,
  ErrorDisplay,
  AccessDenied,
  ExpiredContent,
  Toast,
  ToastContainer,
  Button,
  IconButton,
  ButtonGroup,
  Modal,
  ConfirmModal,
} from './components/common';

// Hooks
export {
  useHouseManual,
  useHouseManualState,
  useHouseManualAccess,
  useCurrentUser,
  useGuestSignup,
  usePhoneVerification,
  useLogin,
  useCreateMagicLink,
  useValidateMagicLink,
  useShareManual,
  useNotifications,
  useNotificationContext,
  NotificationProvider,
} from './hooks';

// Services
export {
  apiClient,
  houseManualService,
  magicLinkService,
  userService,
  emailService,
} from './services';

// Types
export * from './types';

// Utilities
export * from './utils';
