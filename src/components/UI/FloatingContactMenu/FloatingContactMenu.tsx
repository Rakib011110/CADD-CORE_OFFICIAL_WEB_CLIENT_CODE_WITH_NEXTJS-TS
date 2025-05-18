'use client';

import { MessageSquareDotIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  FaFacebookMessenger,
  FaWhatsapp,
  FaPhone,
  FaMapMarkerAlt,
  FaSms,
  FaTimes,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { MagicCard } from '@/components/magicui/magic-card';

export default function FloatingContactMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // controls the permanent CTA visibility
  const [showCTA, setShowCTA] = useState(true);

  // blink logic: show 5s, hide 3s, loop
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;

    if (showCTA) {
      // currently showing → hide after 5s
      hideTimer = setTimeout(() => setShowCTA(false), 5000);
    } else {
      // currently hidden → re‑show after 3s
      showTimer = setTimeout(() => setShowCTA(true), 3000);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, [showCTA]);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-48 pointer-events-none">
      {/* 1️⃣ Blinking Bangla CTA */}
      <AnimatePresence>
        {showCTA && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-24 right-0 w-full bg-white text-black text-sm p-2 rounded-lg shadow-md text-center pointer-events-auto"
          >
            আপনার কোনো প্রশ্ন থাকলে আমাদের&nbsp;জানান
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2️⃣ Expanded menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 pointer-events-auto"
          >
            {[
              {
                href: 'https://m.me/caddcorebd',
                icon: <FaFacebookMessenger size={20} />,
                label: 'Messenger',
                color: 'hover:text-blue-500',
              },
              {
                href: 'https://wa.me/+8801611223631',
                icon: <FaWhatsapp size={20} />,
                label: 'Whatsapp',
                color: 'hover:text-green-500',
              },
              {
                href: 'tel:+8809613202060',
                icon: <FaPhone size={20} />,
                label: 'Call Us',
                color: 'hover:text-blue-400',
              },
              {
                href:
                  'https://goo.gl/maps/xyz', // short URL
                icon: <FaMapMarkerAlt size={20} />,
                label: 'Visit Us',
                color: 'hover:text-red-500',
              },
              {
                href: 'sms:+8801611223637',
                icon: <FaSms size={20} />,
                label: 'SMS',
                color: 'hover:text-purple-500',
              },
            ].map((item, idx) => (
              <MagicCard key={idx}>
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 ${item.color}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </motion.a>
              </MagicCard>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3️⃣ Chat toggle button */}
      <motion.button
        onClick={() => setIsOpen((o) => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute bottom-0  right-0 bg-red-500 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl pointer-events-auto"
      >
        {isOpen ? <FaTimes size={24} /> : <MessageSquareDotIcon className='animate-pulse' size={28} />}
      </motion.button>
    </div>
  );
}
