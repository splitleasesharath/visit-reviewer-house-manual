// ============================================================
// HOOKS INDEX
// Split Lease Application - Export All Custom Hooks
// ============================================================

export {
  useHouseManual,
  useHouseManualState,
  useHouseManualAccess,
} from './useHouseManual';

export {
  useCurrentUser,
  useGuestSignup,
  usePhoneVerification,
  useLogin,
} from './useUser';

export {
  useCreateMagicLink,
  useValidateMagicLink,
  useShareManual,
} from './useMagicLink';

export {
  useNotifications,
  useNotificationContext,
  NotificationProvider,
} from './useNotifications';
