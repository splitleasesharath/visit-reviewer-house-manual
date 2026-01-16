# Visit Reviewer House Manual

A comprehensive React component library for displaying and managing house manual content in the Split Lease application. This component handles visitor and reviewer interactions with property house manuals.

## Features

- **House Manual Display**: Collapsible sections with support for text, images, videos, rules, and checklists
- **User Authentication**: Magic link support, guest signup, and phone verification
- **Access Control**: Role-based visibility (visitor, reviewer, host, admin)
- **Sharing**: Share via email, SMS, QR code, or direct link
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Installation

```bash
npm install @splitlease/visit-reviewer-house-manual
```

## Quick Start

```tsx
import { VisitReviewerHouseManual } from '@splitlease/visit-reviewer-house-manual';

function App() {
  return (
    <VisitReviewerHouseManual
      houseManualId="manual-123"
      displayMode="view"
      onClose={() => console.log('Closed')}
      onSuccess={(manual) => console.log('Loaded:', manual)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

## Components

### Main Component

#### `VisitReviewerHouseManual`

The primary component for displaying house manuals.

```tsx
interface VisitReviewerHouseManualProps {
  houseManualId: string;
  visitorUserId?: string;
  reviewType?: 'property_review' | 'visitor_review' | 'other';
  displayMode?: 'view' | 'edit' | 'preview';
  accessToken?: string;
  onClose?: () => void;
  onSuccess?: (data: HouseManual) => void;
  onError?: (error: ApiError) => void;
}
```

#### `VisitReviewerHouseManualModal`

Modal wrapper for the house manual component.

```tsx
<VisitReviewerHouseManualModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  houseManualId="manual-123"
/>
```

### Sub-Components

- `HeaderSection` - Header with title, property info, and navigation
- `ContentDisplaySection` - Collapsible sections for manual content
- `UserInfoSection` - User profile card with role badge
- `InteractionButtons` - Share, download, print, report, contact actions
- `SignupForm` - Guest signup form

### Common Components

- `Button`, `IconButton`, `ButtonGroup` - Styled button components
- `Modal`, `ConfirmModal` - Modal dialogs
- `Toast`, `ToastContainer` - Toast notifications
- `LoadingSpinner`, `Skeleton` - Loading states
- `ErrorDisplay`, `AccessDenied`, `ExpiredContent` - Error states

## Hooks

### `useHouseManual`

Fetch and manage house manual data.

```tsx
const {
  houseManual,
  sections,
  isLoading,
  error,
  refetch,
  toggleSection,
} = useHouseManual({
  houseManualId: 'manual-123',
  accessToken: 'token',
});
```

### `useCurrentUser`

Get current authenticated user.

```tsx
const { user, isAuthenticated, isLoading, logout } = useCurrentUser();
```

### `useShareManual`

Share house manuals via various methods.

```tsx
const {
  shareViaEmail,
  shareViaSMS,
  shareWithQR,
  copyLink,
  isLoading,
} = useShareManual();
```

### `useNotifications`

Toast notification management.

```tsx
const { showSuccess, showError, notifications } = useNotifications();
```

## Services

### `houseManualService`

- `getHouseManual(id, accessToken)` - Fetch house manual
- `createVisitHouseManual(request)` - Create new manual
- `updateHouseManual(id, updates)` - Update manual
- `getManualSections(id)` - Get sections

### `magicLinkService`

- `createMagicLink(request)` - Generate magic link
- `validateMagicLink(token)` - Validate token
- `createShortLink(id, token)` - Create short URL

### `userService`

- `signupGuestFromHouseManual(request)` - Guest signup
- `requestPhoneVerification(request)` - Send verification code
- `verifyPhoneCode(request)` - Verify code

### `emailService`

- `sendHouseManualEmail(request)` - Send notifications
- `sendManualSharedEmail(...)` - Send share notification

## Types

All TypeScript types are exported from the package:

```tsx
import {
  HouseManual,
  HouseManualSection,
  User,
  UserRole,
  DisplayMode,
  ApiError,
} from '@splitlease/visit-reviewer-house-manual';
```

## Styling

The component uses Tailwind CSS. Include Tailwind in your project and add the component's source to your content configuration:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@splitlease/visit-reviewer-house-manual/src/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
```

## API Integration

The component expects specific backend workflows:

- `CORE-create-each-visit-house-manual` - Create house manual
- `core-create-magic-login-link-for-house-manual` - Generate magic link
- `core-create-short-link-for-house-manual` - Create short URL
- `core-send-house-manual-user-email` - Send email notifications
- `core-signup-guest-from-house-manual` - Guest signup
- `create-each-house-manual-phone-verification` - Phone verification

Configure the API base URL:

```env
REACT_APP_API_BASE_URL=https://api.yourdomain.com/api
```

## Development

```bash
# Install dependencies
npm install

# Run development mode
npm run dev

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint
```

## License

MIT License - Split Lease Team
