import React from 'react';

const PersonalViewdetails = ({ isOpen, onClose, userData }) => {
  if (!isOpen) return null;

  // Default user data structure based on your Prisma schema
  const defaultUserData = {
    // Basic Info
    id: '',
    userId: '',
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    
    // Contact Info
    personalEmail: '',
    phoneNumber: '',
    alternatePhone: '',
    
    // Address Info
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    
    // Additional Info
    maritalStatus: '',
    bloodGroup: '',
    nationality: '',
    
    // System Info
    createdAt: '',
    updatedAt: ''
  };

  const data = { ...defaultUserData, ...userData };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Provided';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    try {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} years`;
    } catch {
      return 'N/A';
    }
  };

  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  const age = calculateAge(data.dateOfBirth);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 border-2 border-white/30">
                    <span className="text-2xl font-bold text-white">
                      {data.firstName ? data.firstName.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{fullName || 'User Details'}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-blue-100 text-sm">ID: {data.userId || 'N/A'}</p>
                      {data.gender && (
                        <span className="text-blue-100 text-sm">• {data.gender}</span>
                      )}
                      {age !== 'N/A' && (
                        <span className="text-blue-100 text-sm">• {age}</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-white/20 p-2 hover:bg-white/30 transition-colors duration-200"
                >
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
              <div className="space-y-6">
                
                {/* 1. Basic Information */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="ID" value={data.id || 'N/A'} />
                    <InfoField label="User ID" value={data.userId || 'N/A'} />
                    <InfoField label="First Name" value={data.firstName || 'Not Provided'} />
                    <InfoField label="Last Name" value={data.lastName || 'Not Provided'} />
                    <InfoField label="Full Name" value={fullName || 'Not Provided'} />
                    <InfoField label="Gender" value={data.gender || 'Not Provided'} />
                    <InfoField label="Date of Birth" value={formatDate(data.dateOfBirth)} />
                    <InfoField label="Age" value={age} />
                  </div>
                </div>

                {/* 2. Contact Information */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Personal Email" value={data.personalEmail || 'Not Provided'} />
                    <InfoField label="Phone Number" value={data.phoneNumber || 'Not Provided'} />
                    <InfoField label="Alternate Phone" value={data.alternatePhone || 'Not Provided'} />
                  </div>
                </div>

                {/* 3. Address Information */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <InfoField label="Address Line 1" value={data.addressLine1 || 'Not Provided'} fullWidth />
                    <InfoField label="Address Line 2" value={data.addressLine2 || 'Not Provided'} fullWidth />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InfoField label="City" value={data.city || 'Not Provided'} />
                      <InfoField label="State" value={data.state || 'Not Provided'} />
                      <InfoField label="Pincode" value={data.pincode || 'Not Provided'} />
                    </div>
                  </div>
                </div>

                {/* 4. Additional Information */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InfoField label="Marital Status" value={data.maritalStatus || 'Not Provided'} />
                    <InfoField label="Blood Group" value={data.bloodGroup || 'Not Provided'} />
                    <InfoField label="Nationality" value={data.nationality || 'Not Provided'} />
                  </div>
                </div>

                {/* 5. System Information */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoField label="Created At" value={formatDate(data.createdAt)} />
                    <InfoField label="Updated At" value={formatDate(data.updatedAt)} />
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8 sm:py-5">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing all personal details ({Object.keys(data).filter(k => data[k] && data[k] !== '').length} fields filled)
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Reusable InfoField component
const InfoField = ({ label, value, fullWidth = false }) => {
  return (
    <div className={fullWidth ? "col-span-1 md:col-span-2" : ""}>
      <label className="block text-xs font-medium uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </label>
      <p className={`text-sm font-medium text-gray-900 ${value === 'Not Provided' || value === 'N/A' ? 'text-gray-500 italic' : ''}`}>
        {value}
      </p>
    </div>
  );
};

export default PersonalViewdetails;