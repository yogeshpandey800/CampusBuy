import React from "react";
import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-amber-500 dark:text-yellow-300 flex items-center justify-center shadow-sm transition-colors duration-300"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.06 }}
    >
      <motion.span
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
      </motion.span>
    </motion.button>
  );
};

export default ThemeToggle;
