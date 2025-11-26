"use client";
import React from "react";
import { motion } from "motion/react";
import { LampContainer } from "@/components/ui/lamp";

export default function LampDemo() {
    return (
        <LampContainer>
            <motion.h1
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="mt-4 sm:mt-6 md:mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-2 sm:py-3 md:py-4 bg-clip-text text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-transparent leading-tight"
            >
                <h1>La vía para tu salud personalizada</h1>
            </motion.h1>
        </LampContainer>
    );
}
