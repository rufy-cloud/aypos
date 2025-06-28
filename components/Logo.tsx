import React from 'react'
interface LogoProps {
  size?: number
  color?: string
  className?: string
}
export const Logo: React.FC<LogoProps> = ({
  size = 40,
  color = '#10B981', // Changed from '#3B82F6' (blue) to '#10B981' (green)
  className = '',
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="B Logo"
      >
        <circle cx="50" cy="50" r="45" fill={color} />
        <path
          d="M35 25H60C67.1797 25 73 30.8203 73 38C73 42.7364 70.6458 46.9006 67 49.2361C71.5162 51.3266 75 56.0873 75 61.5C75 69.5081 68.5081 76 60.5 76H35V25Z"
          fill="white"
        />
        <path
          d="M45 35V47H57.5C59.9853 47 62 44.9853 62 42.5C62 40.0147 59.9853 38 57.5 38H45V35Z"
          fill={color}
        />
        <path
          d="M45 55V66H58C60.7614 66 63 63.7614 63 61C63 58.2386 60.7614 56 58 56H45V55Z"
          fill={color}
        />
      </svg>
    </div>
  )
} 