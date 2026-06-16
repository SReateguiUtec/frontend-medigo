import { motion } from 'framer-motion';

export function AlmaOrb() {
    return (
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center my-8">
            {/* Pulsing rings */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-indigo-400/30"
            />
            <motion.div
                animate={{
                    scale: [1, 1.6, 1],
                    opacity: [0.2, 0, 0.2],
                }}
                transition={{
                    duration: 5,
                    delay: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full border border-cyan-400/20"
            />
            
            {/* Core Orb Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-indigo-500/30 blur-[40px] rounded-full"></div>
            </div>

            {/* Core Orb Element */}
            <motion.div
                animate={{
                    scale: [1, 1.05, 1],
                    boxShadow: [
                        "0 0 40px -10px rgba(99,102,241,0.6)",
                        "0 0 80px -10px rgba(6,182,212,0.8)",
                        "0 0 40px -10px rgba(99,102,241,0.6)",
                    ],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-300 via-blue-500 to-cyan-300 z-10 flex items-center justify-center overflow-hidden"
            >
                {/* Inner highlight */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/60 to-transparent blur-sm rounded-full"></div>
                <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-indigo-900/40 to-transparent blur-md rounded-full"></div>
                
                {/* Center dot */}
                <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 bg-white/80 rounded-full blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.9)]"
                />
            </motion.div>

            {/* Floating particles (simulated with rotated borders) */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 md:w-56 md:h-56 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-300/60 mix-blend-screen"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full border-b-2 border-l-2 border-transparent border-b-indigo-400/60 mix-blend-screen"
            />
            <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full border-t border-transparent border-t-purple-400/40 mix-blend-screen"
            />
        </div>
    );
}
