import { useEffect, useRef, useState } from 'react'

// Type definition for supported languages
type Language = 'en' | 'fr' | 'es'

// Props interface for the LanguageDropdown component
type Props = {
  value: Language // Currently selected language
  onChange: (lang: Language) => void // Callback function triggered when language selection changes
  className?: string // Optional CSS classes for styling
}

// Available language options displayed in the dropdown menu
const options: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'fr', label: 'FR' },
  { value: 'es', label: 'ES' },
]

// Main LanguageDropdown component - renders a custom dropdown for language selection
export function LanguageDropdown({ value, onChange, className = '' }: Props) {
  // State to track whether the dropdown menu is open or closed
  const [open, setOpen] = useState(false)
  // Reference to the root div element, used for detecting clicks outside the dropdown
  const ref = useRef<HTMLDivElement>(null)

  // Effect hook to handle closing the dropdown when user clicks outside of it
  useEffect(() => {
    // Handler function that checks if click target is outside the dropdown
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    // Attach mousedown event listener to document
    document.addEventListener('mousedown', handleClickOutside)
    // Cleanup: remove event listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Find the currently selected language option from the options array
  const selected = options.find((option) => option.value === value)

  // Render the dropdown component
  return (
    // Container div with ref for click-outside detection
    <div
      ref={ref}
      className={`relative inline-block w-24 text-sm ${className}`}
    >
      {/* Toggle button that opens/closes the dropdown */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between border border-gray-300 bg-white px-4 py-2.5 text-base font-medium text-slate-800 shadow-sm transition ${
          open
            ? 'rounded-t-full rounded-b-none border-b-transparent'
            : 'rounded-full'
        }`}
      >
        {/* Display the label of currently selected language */}
        <span>{selected?.label}</span>
        {/* Chevron icon that rotates when dropdown is open */}
        <svg
          className={`h-4 w-4 text-slate-500 transition ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>

      {/* Dropdown menu - only rendered when open is true */}
      {open && (
        <div className="absolute left-0 top-full z-20 -mt-px w-full overflow-hidden rounded-b-3xl border border-gray-300 border-t-0 bg-white shadow-lg">
          {/* Map over options array to create a button for each language */}
          {options.map((option) => {
            // Check if this option is the currently selected language
            const isSelected = option.value === value

            return (
              // Button for each language option
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  // Call onChange callback and close the dropdown
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-base transition ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}