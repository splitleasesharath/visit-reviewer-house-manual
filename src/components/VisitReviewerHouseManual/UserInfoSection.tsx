// ============================================================
// USER INFO SECTION COMPONENT
// Split Lease Application - Reviewer/Visitor Profile Display
// ============================================================

import React from 'react';
import { UserInfoSectionProps, UserRole } from '../../types';
import { getInitials, formatPhoneDisplay, maskEmail } from '../../utils';

// ============================================================
// ICONS
// ============================================================

const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = '', filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const VerifiedIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L3.5 6.5v5c0 4.42 3.58 8 8 8h1c4.42 0 8-3.58 8-8v-5L12 2zm-1.5 12.5l-2.5-2.5 1.41-1.41L10.5 11.67l4.09-4.09 1.41 1.41-5.5 5.5z" />
  </svg>
);

// ============================================================
// AVATAR COMPONENT
// ============================================================

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeStyles = {
  small: 'h-8 w-8 text-xs',
  medium: 'h-12 w-12 text-sm',
  large: 'h-16 w-16 text-lg',
};

const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'medium' }) => {
  const initials = getInitials(name);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizeStyles[size]}
        rounded-full
        bg-gradient-to-br from-blue-500 to-blue-600
        flex items-center justify-center
        text-white font-medium
      `}
    >
      {initials}
    </div>
  );
};

// ============================================================
// ROLE BADGE COMPONENT
// ============================================================

interface RoleBadgeProps {
  role: UserRole;
}

const roleBadgeStyles: Record<UserRole, string> = {
  [UserRole.VISITOR]: 'bg-green-100 text-green-800',
  [UserRole.REVIEWER]: 'bg-blue-100 text-blue-800',
  [UserRole.HOST]: 'bg-purple-100 text-purple-800',
  [UserRole.ADMIN]: 'bg-red-100 text-red-800',
};

const roleLabels: Record<UserRole, string> = {
  [UserRole.VISITOR]: 'Visitor',
  [UserRole.REVIEWER]: 'Reviewer',
  [UserRole.HOST]: 'Host',
  [UserRole.ADMIN]: 'Admin',
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => (
  <span
    className={`
      inline-flex items-center
      px-2.5 py-0.5
      rounded-full text-xs font-medium
      ${roleBadgeStyles[role]}
    `}
  >
    {roleLabels[role]}
  </span>
);

// ============================================================
// RATING DISPLAY COMPONENT
// ============================================================

interface RatingDisplayProps {
  rating: number;
  reviewCount?: number;
  maxRating?: number;
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  maxRating = 5,
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className="h-4 w-4 text-yellow-400" filled />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <StarIcon className="h-4 w-4 text-yellow-400" filled />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
      )}
    </div>
  );
};

// ============================================================
// USER INFO SECTION COMPONENT
// ============================================================

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({
  user,
  showContactInfo = true,
  showReviewBadge = true,
  rating,
  reviewCount,
}) => {
  const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar src={user.avatarUrl} name={displayName} size="large" />

        {/* User Details */}
        <div className="flex-1 min-w-0">
          {/* Name and Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {displayName}
            </h3>
            {showReviewBadge && <RoleBadge role={user.role} />}
            {user.phoneVerified && (
              <VerifiedIcon className="h-5 w-5 text-blue-500" title="Verified" />
            )}
          </div>

          {/* Rating */}
          {rating !== undefined && (
            <div className="mt-1">
              <RatingDisplay rating={rating} reviewCount={reviewCount} />
            </div>
          )}

          {/* Contact Info */}
          {showContactInfo && user.contactPreference !== 'hidden' && (
            <div className="mt-3 space-y-1">
              {user.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <EmailIcon className="h-4 w-4 text-gray-400" />
                  <span>{maskEmail(user.email)}</span>
                </div>
              )}
              {user.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span>{formatPhoneDisplay(user.phoneNumber)}</span>
                  {user.phoneVerified && (
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPACT USER CARD
// ============================================================

interface CompactUserCardProps {
  user: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    role: UserRole;
  };
  onClick?: () => void;
}

export const CompactUserCard: React.FC<CompactUserCardProps> = ({ user, onClick }) => {
  const displayName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Guest';

  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-3 p-3
        bg-white border border-gray-200 rounded-lg
        hover:bg-gray-50 transition-colors
        w-full text-left
      "
    >
      <Avatar src={user.avatarUrl} name={displayName} size="small" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
        <p className="text-xs text-gray-500">{roleLabels[user.role]}</p>
      </div>
      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

export default UserInfoSection;
