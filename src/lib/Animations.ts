import { Variants } from "framer-motion";
import { easeInOut } from "framer-motion";

export const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
};

export const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 2 } },
};


export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeInOut,
    },
  },
};




export const fadeItem: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 16,
      delay: custom,
    },
  }),
};

export const fadeContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export const pulse = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

export const expandFade = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};


// Variants separados para sumar y restar
export const scoreUp = {
  initial: {
    scale: 0.9,
    opacity: 0,
    x: -15,
    rotateY: 45,
  },
  animate: {
    scale: 1,
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 18,
      mass: 2,
    },
  }
};

export const scoreDown = {
  initial: {
    scale: 0.9,
    opacity: 0,
    x: 15,
    rotateY: -45,
  },
  animate: {
    scale: 1,
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      type: "spring" as const,
      stiffness: 180,
      damping: 18,
      mass: 2,
    },
  },
};
