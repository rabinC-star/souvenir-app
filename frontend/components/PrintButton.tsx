'use client'

interface PrintButtonProps {
  onPrint: () => void
  isPrinting: boolean
  trackingNumber: string | null
}

export default function PrintButton({ onPrint, isPrinting, trackingNumber }: PrintButtonProps) {
  return (
    <div className="space-y-4">
      <button
        onClick={onPrint}
        disabled={isPrinting}
        className={`
          w-full py-4 px-6 rounded-lg font-semibold text-lg transition duration-200
          ${isPrinting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isPrinting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Printing...
          </span>
        ) : (
          '🖨️ Print Photo'
        )}
      </button>
      
      {trackingNumber && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">
            ✅ Print job started! Check your email for tracking number:
          </p>
          <p className="text-green-900 font-bold text-xl mt-2">{trackingNumber}</p>
        </div>
      )}
    </div>
  )
}
