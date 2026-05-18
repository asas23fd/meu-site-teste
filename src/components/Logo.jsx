import { motion } from 'framer-motion';

export default function Logo({ size = 36, animated = true }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileHover={animated ? { scale: 1.1, rotate: 5 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {/* Shield shape */}
      <motion.path
        d="M32 4L8 16v16c0 14.4 10.24 27.84 24 32 13.76-4.16 24-17.6 24-32V16L32 4z"
        fill="url(#shieldGradient)"
        stroke="url(#shieldStroke)"
        strokeWidth="2"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {/* Lock body */}
      <motion.rect
        x="22"
        y="28"
        width="20"
        height="16"
        rx="3"
        fill="var(--bg-primary)"
        initial={animated ? { scaleX: 0 } : {}}
        animate={animated ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        style={{ transformOrigin: '32px 36px' }}
      />
      {/* Lock shackle */}
      <motion.path
        d="M26 28v-6a6 6 0 0 1 12 0v6"
        fill="none"
        stroke="var(--bg-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : {}}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
      />
      {/* Keyhole */}
      <motion.circle
        cx="32"
        cy="35"
        r="2.5"
        fill="url(#shieldGradient)"
        initial={animated ? { scale: 0 } : {}}
        animate={animated ? { scale: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.4, type: 'spring' }}
      />
      <motion.rect
        x="31"
        y="36.5"
        width="2"
        height="4"
        rx="1"
        fill="url(#shieldGradient)"
        initial={animated ? { scaleY: 0 } : {}}
        animate={animated ? { scaleY: 1 } : {}}
        transition={{ duration: 0.3, delay: 1.5 }}
        style={{ transformOrigin: '32px 36.5px' }}
      />
      {/* Glow effect */}
      <motion.ellipse
        cx="32"
        cy="32"
        rx="28"
        ry="28"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.3"
        initial={animated ? { scale: 0.8, opacity: 0 } : {}}
        animate={animated ? { scale: [0.8, 1.2, 0.8], opacity: [0, 0.3, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <defs>
        <linearGradient id="shieldGradient" x1="8" y1="4" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="50%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="shieldStroke" x1="8" y1="4" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}