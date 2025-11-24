"use client"

import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef, useState } from "react"

interface TimerProps {
    target?: number;
    duration?: number;
    suffix?: string;
    className?: string;
}

export default function Timer({ target = 100, duration = 2, suffix = "", className = "" }: TimerProps) {
    const count = useMotionValue(0)
    const rounded = useTransform(() => Math.round(count.get()))
    const ref = useRef<HTMLSpanElement>(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    useEffect(() => {
        if (!ref.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    const controls = animate(count, target, { duration })
                    setHasAnimated(true)
                    return () => controls.stop()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(ref.current)

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [target, duration, hasAnimated])

    return (
        <motion.span ref={ref} className={className}>
            <motion.span>{rounded}</motion.span>
            {suffix}
        </motion.span>
    )
}
