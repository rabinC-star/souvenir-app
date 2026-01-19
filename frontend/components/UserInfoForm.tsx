'use client'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  location: string
}

interface UserInfoFormProps {
  userInfo: UserInfo
  onChange: (info: UserInfo) => void
  defaultEmail?: string
}

export default function UserInfoForm({ userInfo, onChange, defaultEmail = '' }: UserInfoFormProps) {
  const handleChange = (field: keyof UserInfo, value: string) => {
    onChange({
      ...userInfo,
      [field]: value,
    })
  }

  // Auto-fill email if not already set
  if (defaultEmail && !userInfo.email) {
    handleChange('email', defaultEmail)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={userInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={userInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={userInfo.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location (City/Place) *
        </label>
        <input
          type="text"
          id="location"
          value={userInfo.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="e.g., New York, NY"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          required
        />
      </div>
    </div>
  )
}
