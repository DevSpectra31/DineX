import React from 'react'

const iconDefaults = {
  width: 30,
  height: 30,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

export const HeartIcon = () => (
  <svg {...iconDefaults}>
    <path d="M12 20.6 5.9 14.8a4.8 4.8 0 0 1 6.8-6.8L12 8.7l-.7-.7a4.8 4.8 0 1 1 6.8 6.8Z" />
  </svg>
)

export const BookmarkIcon = () => (
  <svg {...iconDefaults}>
    <path d="M7 4.4h10v15.2L12 16.5 7 19.6z" />
  </svg>
)

export const CommentIcon = () => (
  <svg {...iconDefaults}>
    <path d="M20 11.5a7.8 7.8 0 0 1-7.8 7.7H8.8L5 22v-4.2A7.8 7.8 0 0 1 12.8 4 7.3 7.3 0 0 1 20 11.5Z" />
  </svg>
)

export const HomeIcon = () => (
  <svg {...iconDefaults} width="26" height="26">
    <path d="M4.8 10.2 12 4l7.2 6.2v8.8H4.8z" />
  </svg>
)

export const SavedIcon = () => (
  <svg {...iconDefaults} width="26" height="26">
    <path d="M7 4.4h10v15.2L12 16.5 7 19.6z" />
  </svg>
)
