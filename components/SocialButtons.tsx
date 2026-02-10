'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function SocialButtons() {
  const buttons = [
    {
      name: 'Google',
      icon: '🔍',
      color: 'hover:border-red-500/50 hover:bg-red-500/10',
    },
    {
      name: 'Discord',
      icon: '💬',
      color: 'hover:border-blue-500/50 hover:bg-blue-500/10',
    },
    {
      name: 'Steam',
      icon: '🎮',
      color: 'hover:border-gray-500/50 hover:bg-gray-500/10',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {buttons.map((button) => (
        <motion.button
          key={button.name}
          className={`py-2.5 px-3 bg-white/5 border border-white/20 rounded-lg transition-all duration-300 ${button.color}`}
          variants={buttonVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">{button.icon}</span>
            <span className="text-xs font-medium text-gray-300">{button.name}</span>
          </div>
        </motion.button>
      ))}
    </motion.div>
  )
}
