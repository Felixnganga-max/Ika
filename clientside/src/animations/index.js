export const buttonClick = {
  whileTap: { scale: 0.95 },
};

export const staggerFadeInout = (i) => {
  return {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 50 },
    transition: { duration: 0.3, delay: 1 * 0.2 },
    key: { i },
  };
};
