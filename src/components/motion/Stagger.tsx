import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    children: React.ReactNode;
    staggerDelay?: number;
    width?: "fit-content" | "100%";
}

export const Stagger = ({ children, staggerDelay = 0.2, width = "100%" }: Props) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    };

    return (
        <motion.div
            style={{ width }}
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
        >
            {React.Children.map(children, (child) => (
                <motion.div variants={item}>
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};
