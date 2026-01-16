import React, { useState } from 'react';
import { DemoHouseManual } from './DemoHouseManual';

// Demo modes
type DemoMode = 'full' | 'modal' | 'components';

const App: React.FC = () => {
  const [demoMode, setDemoMode] = useState<DemoMode>('full');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Demo Controls Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Visit Reviewer House Manual
              </h1>
              <p className="text-sm text-gray-500">Component Demo & Preview</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Mode Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <select
                  value={demoMode}
                  onChange={(e) => setDemoMode(e.target.value as DemoMode)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full">Full Page</option>
                  <option value="modal">Modal</option>
                  <option value="components">Components</option>
                </select>
              </div>
              {demoMode === 'modal' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Open Modal
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <main>
        {demoMode === 'full' && <FullPageDemo />}
        {demoMode === 'modal' && (
          <ModalDemo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
        {demoMode === 'components' && <ComponentsDemo />}
      </main>
    </div>
  );
};

// Full Page Demo
const FullPageDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <DemoHouseManual />
    </div>
  );
};

// Modal Demo
const ModalDemo: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Modal Demo</h2>
          <p className="text-gray-600 mb-6">
            Click the "Open Modal" button in the header to view the house manual in a modal overlay.
          </p>
          <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Modal will appear here as an overlay</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          <div className="absolute inset-4 sm:inset-8 bg-white rounded-lg shadow-xl overflow-hidden">
            <DemoHouseManual onClose={onClose} />
          </div>
        </div>
      )}
    </>
  );
};

// Components Demo
const ComponentsDemo: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header Section Demo */}
      <ComponentCard title="Header Section">
        <HeaderDemo />
      </ComponentCard>

      {/* Content Section Demo */}
      <ComponentCard title="Content Display Section">
        <ContentDemo />
      </ComponentCard>

      {/* User Info Demo */}
      <ComponentCard title="User Info Section">
        <UserInfoDemo />
      </ComponentCard>

      {/* Buttons Demo */}
      <ComponentCard title="Interaction Buttons">
        <ButtonsDemo />
      </ComponentCard>

      {/* Common Components Demo */}
      <ComponentCard title="Common Components">
        <CommonComponentsDemo />
      </ComponentCard>
    </div>
  );
};

const ComponentCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

// Component Demos
const HeaderDemo: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-start space-x-4">
          <button className="mt-1 p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome to Sunset Villa</h1>
            <div className="mt-1 flex items-center space-x-2 text-gray-600">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-sm">
                <span className="font-medium">Sunset Villa</span> · 123 Ocean Drive, Miami Beach, FL
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Last updated 2 hours ago</p>
          </div>
        </div>
      </header>
    </div>
  );
};

const ContentDemo: React.FC = () => {
  const [expanded, setExpanded] = useState<string[]>(['wifi']);

  const sections = [
    { id: 'wifi', title: 'WiFi & Internet', icon: '📶' },
    { id: 'kitchen', title: 'Kitchen & Appliances', icon: '🍳' },
    { id: 'rules', title: 'House Rules', icon: '📋' },
  ];

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() =>
              setExpanded((prev) =>
                prev.includes(section.id)
                  ? prev.filter((id) => id !== section.id)
                  : [...prev, section.id]
              )
            }
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <span>{section.icon}</span>
              <h3 className="font-medium text-gray-900">{section.title}</h3>
            </div>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform ${
                expanded.includes(section.id) ? 'rotate-180' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {expanded.includes(section.id) && (
            <div className="px-4 py-4 text-sm text-gray-700">
              {section.id === 'wifi' && (
                <div>
                  <p className="mb-2"><strong>Network:</strong> SunsetVilla_Guest</p>
                  <p><strong>Password:</strong> Welcome2024!</p>
                </div>
              )}
              {section.id === 'kitchen' && (
                <p>
                  The kitchen is fully equipped with a refrigerator, stove, microwave, coffee maker,
                  and dishwasher. Please clean up after use.
                </p>
              )}
              {section.id === 'rules' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>No smoking inside the property</li>
                  <li>Quiet hours: 10 PM - 8 AM</li>
                  <li>Maximum 6 guests allowed</li>
                  <li>No parties or events</li>
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const UserInfoDemo: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-medium">
          JD
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Visitor
            </span>
            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L3.5 6.5v5c0 4.42 3.58 8 8 8h1c4.42 0 8-3.58 8-8v-5L12 2zm-1.5 12.5l-2.5-2.5 1.41-1.41L10.5 11.67l4.09-4.09 1.41 1.41-5.5 5.5z" />
            </svg>
          </div>
          <div className="mt-1 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-sm font-medium text-gray-700 ml-1">4.5</span>
            <span className="text-sm text-gray-500">(12 reviews)</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>j***@email.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(555) 123-4567</span>
              <span className="text-xs text-green-600 font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ButtonsDemo: React.FC = () => {
  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="flex flex-wrap gap-2">
        <button className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Share
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download
        </button>
        <button className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print
        </button>
        <button className="inline-flex items-center px-3 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
          </svg>
          Report Issue
        </button>
        <button className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
          Contact Host
        </button>
      </div>
    </div>
  );
};

const CommonComponentsDemo: React.FC = () => {
  const [showToast, setShowToast] = useState(false);

  return (
    <div className="space-y-6">
      {/* Buttons */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Buttons</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Primary
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 font-medium">
            Secondary
          </button>
          <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Outline
          </button>
          <button className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
            Ghost
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">
            Danger
          </button>
        </div>
      </div>

      {/* Loading States */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Loading States</h4>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-500 mt-2">Spinner</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <span className="text-xs text-gray-500">Skeleton</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Toast Notifications</h4>
        <button
          onClick={() => setShowToast(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          Show Toast
        </button>
        {showToast && (
          <div className="mt-3 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg max-w-sm">
            <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="flex-1 text-sm text-green-800">Link copied to clipboard!</p>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-green-100 rounded-full"
            >
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Error States */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Error States</h4>
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Something went wrong. Please try again.</span>
        </div>
      </div>
    </div>
  );
};

export default App;
