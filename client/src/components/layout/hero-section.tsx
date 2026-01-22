import { ReactNode } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }
};

interface HeroSectionProps {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
  showOverlay?: boolean;
}

export function HeroSection({ 
  title, 
  subtitle, 
  children, 
  className = "", 
}: HeroSectionProps) {
  return (
    <section 
      className={`relative overflow-hidden pt-8 pb-6 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 bg-white flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        <motion.div 
          className="w-full text-center flex flex-col items-center justify-center"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div className="w-full mb-0 sm:mb-6 flex flex-col items-center justify-center" variants={fadeIn}>
            {title}
          </motion.div>
          <div className="max-w-4xl flex flex-col items-center justify-center">
            {subtitle && (
              <motion.div 
                className="text-xs sm:text-xl lg:text-2xl text-brand-dark mb-4 sm:mb-8 leading-relaxed font-medium text-center"
                variants={fadeIn}
              >
                {subtitle}
              </motion.div>
            )}
            <motion.div className="flex flex-col items-center justify-center gap-2 sm:gap-4 w-full" variants={fadeIn}>
              {children}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
