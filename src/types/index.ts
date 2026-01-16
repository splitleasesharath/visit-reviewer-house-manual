// ============================================================
// VISIT REVIEWER HOUSE MANUAL - TYPE DEFINITIONS
// Split Lease Application - TypeScript Types
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export enum UserRole {
  VISITOR = 'visitor',
  REVIEWER = 'reviewer',
  HOST = 'host',
  ADMIN = 'admin',
}

export enum DisplayMode {
  VIEW = 'view',
  EDIT = 'edit',
  PREVIEW = 'preview',
}

export enum ReviewType {
  PROPERTY_REVIEW = 'property_review',
  VISITOR_REVIEW = 'visitor_review',
  OTHER = 'other',
}

export enum ManualStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
}

export enum SectionType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  RULES = 'rules',
  CONTACT = 'contact',
  AMENITIES = 'amenities',
  CHECKLIST = 'checklist',
}

export enum NotificationType {
  MANUAL_CREATED = 'manual_created',
  MANUAL_UPDATED = 'manual_updated',
  ACCESS_SHARED = 'access_shared',
  REMINDER = 'reminder',
  EXPIRATION_WARNING = 'expiration_warning',
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

// ============================================================
// USER TYPES
// ============================================================

export interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  contactPreference?: 'shown' | 'hidden';
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

export interface GuestUser {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  password?: string;
  referralSource?: string;
  preferences?: Record<string, unknown>;
}

// ============================================================
// HOUSE MANUAL TYPES
// ============================================================

export interface HouseManual {
  id: string;
  title: string;
  description?: string;
  propertyId: string;
  propertyName: string;
  propertyAddress?: string;
  createdByUserId: string;
  status: ManualStatus;
  statusBadge?: string;
  sections: HouseManualSection[];
  permissions: ManualPermissions;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
  modifiedDate: string;
  accessToken?: string;
}

export interface HouseManualSection {
  id: string;
  manualId: string;
  title: string;
  type: SectionType;
  content: string;
  order: number;
  isCollapsible: boolean;
  isExpanded?: boolean;
  mediaItems?: MediaItem[];
  rules?: RuleItem[];
  checklistItems?: ChecklistItem[];
  visibility: 'all' | 'reviewer' | 'visitor' | 'host';
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  caption?: string;
  order: number;
}

export interface RuleItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  icon?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  isRequired: boolean;
}

export interface ManualPermissions {
  canView: string[];
  canEdit: string[];
  canShare: string[];
  canDelete: string[];
  isPublic: boolean;
}

// ============================================================
// PROPERTY TYPES
// ============================================================

export interface Property {
  id: string;
  name: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  description?: string;
  images?: string[];
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// MAGIC LINK TYPES
// ============================================================

export interface MagicLink {
  id: string;
  token: string;
  encryptedToken: string;
  shortUrl: string;
  houseManualId: string;
  createdByUserId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  expiresAt: string;
  isSingleUse: boolean;
  isUsed: boolean;
  usedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface MagicLinkRequest {
  houseManualId: string;
  recipientEmail?: string;
  recipientPhone?: string;
  expirationHours?: number;
  isSingleUse?: boolean;
  deliveryMethod: 'email' | 'sms' | 'qr' | 'direct';
}

export interface MagicLinkResponse {
  success: boolean;
  magicLink?: MagicLink;
  shortUrl?: string;
  qrCodeUrl?: string;
  error?: string;
}

// ============================================================
// VERIFICATION TYPES
// ============================================================

export interface PhoneVerification {
  id: string;
  userId: string;
  phoneNumber: string;
  code: string;
  expiresAt: string;
  attemptCount: number;
  maxAttempts: number;
  status: VerificationStatus;
  verifiedAt?: string;
  createdAt: string;
}

export interface PhoneVerificationRequest {
  userId: string;
  phoneNumber: string;
}

export interface PhoneVerificationResponse {
  success: boolean;
  verificationId?: string;
  expiresAt?: string;
  error?: string;
}

export interface VerifyCodeRequest {
  verificationId: string;
  code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  isVerified: boolean;
  remainingAttempts?: number;
  error?: string;
}

// ============================================================
// EMAIL NOTIFICATION TYPES
// ============================================================

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientUserId?: string;
  type: NotificationType;
  subject: string;
  body: string;
  templateId?: string;
  templateData?: Record<string, unknown>;
  houseManualId?: string;
  propertyId?: string;
  status: 'queued' | 'sent' | 'failed' | 'bounced';
  sentAt?: string;
  failureReason?: string;
  retryCount: number;
  createdAt: string;
}

export interface SendEmailRequest {
  recipientEmail: string;
  recipientUserId?: string;
  type: NotificationType;
  houseManualId: string;
  customSubject?: string;
  customBody?: string;
  templateData?: Record<string, unknown>;
}

export interface SendEmailResponse {
  success: boolean;
  notificationId?: string;
  error?: string;
}

// ============================================================
// WORKFLOW TYPES
// ============================================================

export interface CreateHouseManualRequest {
  visitorUserId: string;
  propertyId: string;
  houseManualTemplateId?: string;
  title?: string;
  description?: string;
}

export interface CreateHouseManualResponse {
  success: boolean;
  houseManualId?: string;
  createdAt?: string;
  accessToken?: string;
  status?: string;
  error?: ApiError;
}

export interface SignupGuestRequest {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  password: string;
  houseManualId: string;
  propertyId?: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  referralSource?: string;
}

export interface SignupGuestResponse {
  success: boolean;
  userId?: string;
  accessToken?: string;
  user?: User;
  error?: ApiError;
}

// ============================================================
// API ERROR TYPES
// ============================================================

export interface ApiError {
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

export interface ValidationError {
  field: string;
  message: string;
}

// ============================================================
// COMPONENT PROPS TYPES
// ============================================================

export interface VisitReviewerHouseManualProps {
  houseManualId: string;
  visitorUserId?: string;
  reviewType?: ReviewType;
  displayMode?: DisplayMode;
  accessToken?: string;
  onClose?: () => void;
  onSuccess?: (data: HouseManual) => void;
  onError?: (error: ApiError) => void;
}

export interface HeaderSectionProps {
  title: string;
  propertyName?: string;
  propertyAddress?: string;
  lastUpdated?: string;
  onBack?: () => void;
  showBreadcrumb?: boolean;
  breadcrumbItems?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ContentDisplaySectionProps {
  sections: HouseManualSection[];
  userRole: UserRole;
  isLoading?: boolean;
  onSectionToggle?: (sectionId: string) => void;
}

export interface UserInfoSectionProps {
  user: User;
  showContactInfo?: boolean;
  showReviewBadge?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface InteractionButtonsProps {
  houseManualId: string;
  canShare: boolean;
  canDownload: boolean;
  canPrint: boolean;
  canReport: boolean;
  canContact: boolean;
  onShare?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onReport?: () => void;
  onContact?: () => void;
}

// ============================================================
// STATE TYPES
// ============================================================

export interface HouseManualState {
  houseManual: HouseManual | null;
  isLoading: boolean;
  error: ApiError | null;
  displayMode: DisplayMode;
}

export interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ApiError | null;
}

export interface UIState {
  isModalOpen: boolean;
  activeSection?: string;
  expandedSections: string[];
  notifications: ToastNotification[];
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

// ============================================================
// FORM TYPES
// ============================================================

export interface SignupFormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

export interface ShareFormData {
  recipientEmail: string;
  recipientPhone?: string;
  message?: string;
  deliveryMethod: 'email' | 'sms' | 'both';
  expirationHours: number;
}

export interface ReportIssueFormData {
  issueType: string;
  description: string;
  attachments?: File[];
}

// ============================================================
// PAGINATION TYPES
// ============================================================

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
