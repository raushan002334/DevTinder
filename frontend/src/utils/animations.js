// Page transitions
export const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: 0.3 } 
  },
};

// Card animations
export const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: "easeOut" } 
  },
  hover: { 
    y: -5, 
    boxShadow: "0 20px 40px rgba(0, 208, 132, 0.2)",
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: 0.2 } 
  },
};

// Swipe animations
export const swipeVariants = {
  liked: { 
    x: 300, 
    opacity: 0, 
    rotate: 20, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
  disliked: { 
    x: -300, 
    opacity: 0, 
    rotate: -20, 
    transition: { duration: 0.6, ease: "easeOut" } 
  },
};

// Button animations
export const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
};

// List animations
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: 0.1, 
      delayChildren: 0.2,
      ease: "easeOut"
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 } 
  },
  hover: { 
    x: 5, 
    transition: { duration: 0.2 } 
  },
};

// Form animations
export const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.4 } 
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    transition: { duration: 0.3 } 
  },
};

// Input focus animation
export const inputVariants = {
  focus: { 
    boxShadow: "0 0 0 3px rgba(0, 208, 132, 0.1)",
    borderColor: "#00d084",
    transition: { duration: 0.2 }
  },
};
