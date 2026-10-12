"use client";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

export default function Reveal({ delay = 0, y = 40, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
