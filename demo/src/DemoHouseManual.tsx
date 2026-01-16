import React, { useState } from 'react';

// Mock data for demo
const mockHouseManual = {
  id: 'manual-demo-123',
  title: 'Welcome to Sunset Villa',
  propertyName: 'Sunset Villa',
  propertyAddress: '123 Ocean Drive, Miami Beach, FL 33139',
  modifiedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  sections: [
    {
      id: 'wifi',
      title: 'WiFi & Internet',
      type: 'text',
      icon: '📶',
      content: `
        <p><strong>Network Name:</strong> SunsetVilla_Guest</p>
        <p><strong>Password:</strong> Welcome2024!</p>
        <p class="mt-2 text-gray-600">The WiFi signal is strongest in the living room and bedrooms. If you experience any connectivity issues, try restarting the router located in the office closet.</p>
      `,
    },
    {
      id: 'checkin',
      title: 'Check-in & Check-out',
      type: 'text',
      icon: '🔑',
      content: `
        <div class="space-y-3">
          <div class="p-3 bg-blue-50 rounded-lg">
            <p class="font-medium text-blue-800">Check-in: 3:00 PM</p>
            <p class="font-medium text-blue-800">Check-out: 11:00 AM</p>
          </div>
          <p><strong>Keyless Entry:</strong> Your access code is <span class="font-mono bg-gray-100 px-2 py-1 rounded">4523</span></p>
          <p>Enter the code on the keypad located on the front door. The code will be active from 3:00 PM on your check-in date.</p>
        </div>
      `,
    },
    {
      id: 'kitchen',
      title: 'Kitchen & Appliances',
      type: 'text',
      icon: '🍳',
      content: `
        <p>The kitchen is fully equipped with modern appliances:</p>
        <ul class="list-disc list-inside mt-2 space-y-1">
          <li>Full-size refrigerator with ice maker</li>
          <li>Gas stove and oven</li>
          <li>Microwave</li>
          <li>Dishwasher</li>
          <li>Coffee maker (Keurig) - pods provided</li>
          <li>Toaster and blender</li>
        </ul>
        <p class="mt-3 text-gray-600">Please start the dishwasher before check-out if you've used dishes.</p>
      `,
    },
    {
      id: 'rules',
      title: 'House Rules',
      type: 'rules',
      icon: '📋',
      rules: [
        { id: '1', text: 'No smoking inside the property or on balconies', priority: 'high' },
        { id: '2', text: 'Quiet hours: 10:00 PM - 8:00 AM', priority: 'high' },
        { id: '3', text: 'Maximum 6 guests allowed (including children)', priority: 'medium' },
        { id: '4', text: 'No parties or events without prior approval', priority: 'high' },
        { id: '5', text: 'Pets allowed with $50 pet fee - notify host in advance', priority: 'medium' },
        { id: '6', text: 'Please remove shoes when entering', priority: 'low' },
      ],
    },
    {
      id: 'parking',
      title: 'Parking',
      type: 'text',
      icon: '🚗',
      content: `
        <p>The property includes 2 dedicated parking spots in the driveway.</p>
        <p class="mt-2"><strong>Guest Code for Gate:</strong> <span class="font-mono bg-gray-100 px-2 py-1 rounded">#1234</span></p>
        <p class="mt-2 text-gray-600">Street parking is also available but be mindful of street cleaning days (Tuesday mornings).</p>
      `,
    },
    {
      id: 'pool',
      title: 'Pool & Hot Tub',
      type: 'text',
      icon: '🏊',
      content: `
        <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-3">
          <p class="text-yellow-800 font-medium">⚠️ No lifeguard on duty. Swim at your own risk.</p>
        </div>
        <p><strong>Pool Hours:</strong> 8:00 AM - 10:00 PM</p>
        <p><strong>Hot Tub:</strong> Controls located on the side panel. Max temp: 104°F</p>
        <p class="mt-2">Towels for pool use are in the outdoor cabinet. Please do not take indoor towels outside.</p>
      `,
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      type: 'contact',
      icon: '🆘',
      content: `
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <span class="font-medium text-red-800">Emergency Services</span>
            <a href="tel:911" class="text-red-600 font-bold">911</a>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="font-medium">Property Manager (Sarah)</span>
            <a href="tel:+15551234567" class="text-blue-600">(555) 123-4567</a>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="font-medium">24/7 Maintenance</span>
            <a href="tel:+15559876543" class="text-blue-600">(555) 987-6543</a>
          </div>
        </div>
      `,
    },
    {
      id: 'checkout',
      title: 'Check-out Checklist',
      type: 'checklist',
      icon: '✅',
      checklist: [
        { id: '1', text: 'Strip beds and place linens in hamper', isRequired: true },
        { id: '2', text: 'Load and start dishwasher', isRequired: true },
        { id: '3', text: 'Take out trash to bins by garage', isRequired: true },
        { id: '4', text: 'Turn off all lights and fans', isRequired: true },
        { id: '5', text: 'Lock all doors and windows', isRequired: true },
        { id: '6', text: 'Set thermostat to 72°F', isRequired: false },
        { id: '7', text: 'Return any moved furniture to original position', isRequired: false },
      ],
    },
  ],
};

const mockUser = {
  id: 'user-123',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '+15551234567',
  phoneVerified: true,
  role: 'visitor',
};

interface DemoHouseManualProps {
  onClose?: () => void;
}

export const DemoHouseManual: React.FC<DemoHouseManualProps> = ({ onClose }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['wifi', 'checkin']);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleCheckItem = (itemId: string) => {
    setCheckedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'just now';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.round(diffHours / 24);
    if (diffDays === 1) return 'yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg shadow-lg max-w-sm animate-fade-in">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="flex-1 text-sm text-green-800">{toastMessage}</p>
          <button onClick={() => setShowToast(false)} className="p-1 hover:bg-green-100 rounded-full">
            <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {onClose && (
              <button
                onClick={onClose}
                className="mt-1 p-2 -ml-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {mockHouseManual.title}
              </h1>
              <div className="mt-1 flex items-center space-x-2 text-gray-600">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-sm">
                  <span className="font-medium">{mockHouseManual.propertyName}</span>
                  <span className="hidden sm:inline"> · {mockHouseManual.propertyAddress}</span>
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Last updated {formatRelativeTime(mockHouseManual.modifiedDate)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* User Info Card */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white sm:px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{mockUser.fullName}</h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Visitor
                </span>
                <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3.5 6.5v5c0 4.42 3.58 8 8 8h1c4.42 0 8-3.58 8-8v-5L12 2zm-1.5 12.5l-2.5-2.5 1.41-1.41L10.5 11.67l4.09-4.09 1.41 1.41-5.5 5.5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Welcome! We hope you enjoy your stay.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="space-y-4">
          {mockHouseManual.sections.map((section) => (
            <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="font-medium text-gray-900">{section.title}</h3>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    expandedSections.includes(section.id) ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Section Content */}
              {expandedSections.includes(section.id) && (
                <div className="px-4 py-4">
                  {/* Text Content */}
                  {section.content && (
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}

                  {/* Rules */}
                  {section.rules && (
                    <div className="space-y-2">
                      {section.rules.map((rule: any) => {
                        const priorityStyles = {
                          high: 'bg-red-50 border-red-200 text-red-800',
                          medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                          low: 'bg-gray-50 border-gray-200 text-gray-700',
                        };
                        const priorityIcons = {
                          high: '🚫',
                          medium: '⚠️',
                          low: '💡',
                        };
                        return (
                          <div
                            key={rule.id}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${priorityStyles[rule.priority as keyof typeof priorityStyles]}`}
                          >
                            <span>{priorityIcons[rule.priority as keyof typeof priorityIcons]}</span>
                            <span className="text-sm">{rule.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Checklist */}
                  {section.checklist && (
                    <div className="space-y-1">
                      {section.checklist.map((item: any) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={checkedItems.includes(item.id)}
                            onChange={() => toggleCheckItem(item.id)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className={`text-sm ${
                              checkedItems.includes(item.id) ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                          >
                            {item.text}
                            {item.isRequired && <span className="text-red-500 ml-1">*</span>}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share
          </button>
          <button
            onClick={() => showNotification('Download started...')}
            className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-1.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>
          <button
            onClick={() => showNotification('Report submitted. Thank you!')}
            className="inline-flex items-center px-3 py-1.5 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            Report Issue
          </button>
          <button
            onClick={() => showNotification('Opening contact form...')}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            Contact Host
          </button>
        </div>
      </footer>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowShareModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl max-w-sm w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Share House Manual</h3>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'copy', icon: '📋', label: 'Copy Link' },
                { id: 'email', icon: '📧', label: 'Email' },
                { id: 'sms', icon: '💬', label: 'SMS' },
                { id: 'qr', icon: '📱', label: 'QR Code' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setShowShareModal(false);
                    showNotification(option.id === 'copy' ? 'Link copied to clipboard!' : `Sharing via ${option.label}...`);
                  }}
                  className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DemoHouseManual;
