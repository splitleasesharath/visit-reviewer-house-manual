// ============================================================
// CONTENT DISPLAY SECTION COMPONENT
// Split Lease Application - House Manual Content Display
// ============================================================

import React, { useState } from 'react';
import {
  ContentDisplaySectionProps,
  HouseManualSection,
  SectionType,
  UserRole,
  MediaItem,
  RuleItem,
  ChecklistItem,
} from '../../types';
import { Skeleton } from '../common';

// ============================================================
// ICONS
// ============================================================

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const PlayIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// ============================================================
// SECTION TYPE ICONS
// ============================================================

const sectionIcons: Record<SectionType, React.ReactNode> = {
  [SectionType.TEXT]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  [SectionType.IMAGE]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  [SectionType.VIDEO]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  [SectionType.RULES]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  [SectionType.CONTACT]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  [SectionType.AMENITIES]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  [SectionType.CHECKLIST]: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
};

// ============================================================
// RULE ITEM COMPONENT
// ============================================================

interface RuleItemDisplayProps {
  rule: RuleItem;
}

const RuleItemDisplay: React.FC<RuleItemDisplayProps> = ({ rule }) => {
  const priorityStyles = {
    high: 'bg-red-50 border-red-200 text-red-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    low: 'bg-gray-50 border-gray-200 text-gray-700',
  };

  const priorityIcons = {
    high: <AlertIcon className="h-4 w-4 text-red-500" />,
    medium: <AlertIcon className="h-4 w-4 text-yellow-500" />,
    low: <CheckIcon className="h-4 w-4 text-gray-400" />,
  };

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${priorityStyles[rule.priority]}`}>
      <span className="flex-shrink-0 mt-0.5">{priorityIcons[rule.priority]}</span>
      <span className="text-sm">{rule.text}</span>
    </div>
  );
};

// ============================================================
// CHECKLIST ITEM COMPONENT
// ============================================================

interface ChecklistItemDisplayProps {
  item: ChecklistItem;
  onToggle?: (id: string, checked: boolean) => void;
  readOnly?: boolean;
}

const ChecklistItemDisplay: React.FC<ChecklistItemDisplayProps> = ({
  item,
  onToggle,
  readOnly = false,
}) => {
  return (
    <label
      className={`
        flex items-center gap-3 p-2 rounded-lg
        ${readOnly ? '' : 'cursor-pointer hover:bg-gray-50'}
        ${item.isChecked ? 'text-gray-500' : 'text-gray-900'}
      `}
    >
      <input
        type="checkbox"
        checked={item.isChecked}
        onChange={(e) => onToggle?.(item.id, e.target.checked)}
        disabled={readOnly}
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className={`text-sm ${item.isChecked ? 'line-through' : ''}`}>
        {item.text}
        {item.isRequired && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
  );
};

// ============================================================
// MEDIA GALLERY COMPONENT
// ============================================================

interface MediaGalleryProps {
  items: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Grid of media items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setSelectedIndex(index)}
            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {item.type === 'image' ? (
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.altText || `Image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <PlayIcon className="h-10 w-10 text-white opacity-80" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox/Modal for selected media */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close"
          >
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <div className="max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            {items[selectedIndex].type === 'image' ? (
              <img
                src={items[selectedIndex].url}
                alt={items[selectedIndex].altText || ''}
                className="max-w-full max-h-[85vh] object-contain"
              />
            ) : (
              <video
                src={items[selectedIndex].url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh]"
              />
            )}
            {items[selectedIndex].caption && (
              <p className="text-white text-center mt-2">{items[selectedIndex].caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// COLLAPSIBLE SECTION COMPONENT
// ============================================================

interface CollapsibleSectionProps {
  section: HouseManualSection;
  isExpanded: boolean;
  onToggle: () => void;
  userRole: UserRole;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  section,
  isExpanded,
  onToggle,
  userRole,
}) => {
  // Check visibility based on user role
  if (section.visibility !== 'all' && section.visibility !== userRole) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        onClick={onToggle}
        className="
          w-full flex items-center justify-between
          px-4 py-3 bg-gray-50 hover:bg-gray-100
          transition-colors text-left
        "
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{sectionIcons[section.type]}</span>
          <h3 className="font-medium text-gray-900">{section.title}</h3>
        </div>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="px-4 py-4 space-y-4">
          {/* Text Content */}
          {section.content && (
            <div
              className="prose prose-sm max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          )}

          {/* Media Gallery */}
          {section.mediaItems && section.mediaItems.length > 0 && (
            <MediaGallery items={section.mediaItems} />
          )}

          {/* Rules List */}
          {section.rules && section.rules.length > 0 && (
            <div className="space-y-2">
              {section.rules.map((rule) => (
                <RuleItemDisplay key={rule.id} rule={rule} />
              ))}
            </div>
          )}

          {/* Checklist */}
          {section.checklistItems && section.checklistItems.length > 0 && (
            <div className="space-y-1">
              {section.checklistItems.map((item) => (
                <ChecklistItemDisplay key={item.id} item={item} readOnly />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================
// LOADING SKELETON
// ============================================================

const SectionsSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-3">
            <Skeleton width="w-5" height="h-5" rounded="full" />
            <Skeleton width="w-32" height="h-5" />
          </div>
        </div>
        {i === 1 && (
          <div className="px-4 py-4 space-y-3">
            <Skeleton height="h-4" />
            <Skeleton height="h-4" />
            <Skeleton width="w-3/4" height="h-4" />
          </div>
        )}
      </div>
    ))}
  </div>
);

// ============================================================
// MAIN CONTENT DISPLAY SECTION COMPONENT
// ============================================================

export const ContentDisplaySection: React.FC<ContentDisplaySectionProps> = ({
  sections,
  userRole,
  isLoading = false,
  onSectionToggle,
}) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    sections.length > 0 ? [sections[0]?.id] : []
  );

  const handleToggle = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
    onSectionToggle?.(sectionId);
  };

  if (isLoading) {
    return <SectionsSkeleton />;
  }

  if (!sections || sections.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content available for this house manual.</p>
      </div>
    );
  }

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="p-4 space-y-4">
      {sortedSections.map((section) => (
        <CollapsibleSection
          key={section.id}
          section={section}
          isExpanded={expandedSections.includes(section.id)}
          onToggle={() => handleToggle(section.id)}
          userRole={userRole}
        />
      ))}
    </div>
  );
};

export default ContentDisplaySection;
