// ============================================================
// FORMATTER UTILITIES
// Split Lease Application - Data Formatting Functions
// ============================================================

// ============================================================
// DATE & TIME FORMATTERS
// ============================================================

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormat options
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
};

/**
 * Format date to short format (MM/DD/YYYY)
 * @param date - Date string or Date object
 */
export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Format date with time
 * @param date - Date string or Date object
 */
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string or Date object
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 30) {
    return rtf.format(diffDay, 'day');
  } else {
    return formatDate(dateObj);
  }
};

/**
 * Format "Last updated" text
 * @param date - Date string or Date object
 */
export const formatLastUpdated = (date: string | Date): string => {
  return `Last updated ${formatRelativeTime(date)}`;
};

/**
 * Check if date is expired
 * @param expirationDate - Expiration date string or Date object
 */
export const isExpired = (expirationDate: string | Date): boolean => {
  const dateObj = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  return dateObj.getTime() < Date.now();
};

/**
 * Get days until expiration
 * @param expirationDate - Expiration date string or Date object
 */
export const getDaysUntilExpiration = (expirationDate: string | Date): number => {
  const dateObj = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  const diffMs = dateObj.getTime() - Date.now();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

// ============================================================
// NAME FORMATTERS
// ============================================================

/**
 * Get user's initials from name
 * @param name - Full name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format full name from first and last name
 * @param firstName - First name
 * @param lastName - Last name
 */
export const formatFullName = (firstName?: string, lastName?: string): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ');
};

/**
 * Truncate name with ellipsis
 * @param name - Name to truncate
 * @param maxLength - Maximum length
 */
export const truncateName = (name: string, maxLength: number = 20): string => {
  if (!name || name.length <= maxLength) return name;
  return `${name.substring(0, maxLength)}...`;
};

// ============================================================
// PHONE NUMBER FORMATTERS
// ============================================================

/**
 * Format phone number for display
 * @param phone - Phone number (E.164 or digits only)
 */
export const formatPhoneDisplay = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digit characters except leading +
  const hasPlus = phone.startsWith('+');
  const digits = phone.replace(/\D/g, '');

  // Format US phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  // Return with + if original had it
  return hasPlus ? `+${digits}` : digits;
};

/**
 * Mask phone number for privacy
 * @param phone - Phone number
 */
export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;

  const lastFour = digits.slice(-4);
  return `***-***-${lastFour}`;
};

// ============================================================
// EMAIL FORMATTERS
// ============================================================

/**
 * Mask email for privacy
 * @param email - Email address
 */
export const maskEmail = (email: string): string => {
  if (!email) return '';

  const [localPart, domain] = email.split('@');
  if (!domain) return email;

  const maskedLocal =
    localPart.length > 2
      ? `${localPart.charAt(0)}***${localPart.charAt(localPart.length - 1)}`
      : `${localPart.charAt(0)}***`;

  return `${maskedLocal}@${domain}`;
};

// ============================================================
// ADDRESS FORMATTERS
// ============================================================

interface AddressComponents {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

/**
 * Format address for display
 * @param address - Address components
 */
export const formatAddress = (address: AddressComponents): string => {
  const parts: string[] = [];

  if (address.street) parts.push(address.street);

  const cityStateZip: string[] = [];
  if (address.city) cityStateZip.push(address.city);
  if (address.state) cityStateZip.push(address.state);
  if (address.zipCode) cityStateZip.push(address.zipCode);

  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '));
  }

  if (address.country && address.country !== 'US' && address.country !== 'USA') {
    parts.push(address.country);
  }

  return parts.join('\n');
};

/**
 * Format address as single line
 * @param address - Address components
 */
export const formatAddressOneLine = (address: AddressComponents): string => {
  return formatAddress(address).replace(/\n/g, ', ');
};

// ============================================================
// TEXT FORMATTERS
// ============================================================

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitalize first letter of each word
 * @param text - Text to capitalize
 */
export const capitalizeWords = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Convert to title case
 * @param text - Text to convert
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  return text.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
};

/**
 * Convert snake_case or kebab-case to Title Case
 * @param text - Text to convert
 */
export const formatSnakeOrKebabCase = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// ============================================================
// NUMBER FORMATTERS
// ============================================================

/**
 * Format number with commas
 * @param num - Number to format
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Format as currency
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format rating (e.g., 4.5)
 * @param rating - Rating value
 * @param maxRating - Maximum rating (default: 5)
 */
export const formatRating = (rating: number, maxRating: number = 5): string => {
  return `${rating.toFixed(1)}/${maxRating}`;
};
