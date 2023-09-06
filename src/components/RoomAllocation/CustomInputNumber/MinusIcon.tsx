import * as React from 'react'

const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? 24}
    height={props.height ?? 24}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={props.color ?? '#000'}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 12h12"
    />
  </svg>
)
export default SvgComponent
