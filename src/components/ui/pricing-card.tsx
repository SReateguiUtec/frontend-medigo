"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PricingFeature {
  title: string
  items: string[]
}

interface PricingCardProps {
  title: string
  description: string
  price: number | string
  originalPrice?: number
  features: PricingFeature[]
  buttonText?: string
  onButtonClick?: () => void
  pricePrefix?: string
  priceSuffix?: string
  paymentNote?: string
}

export function PricingCard({
  title,
  description,
  price,
  originalPrice,
  features,
  buttonText = "Get Started",
  onButtonClick,
  pricePrefix = "$",
  priceSuffix = "",
  paymentNote = "one-time payment",
}: PricingCardProps) {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [isInView, hasAnimated])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  }

  return (
    <motion.section
      ref={containerRef}
      className="container pt-14 pb-12 md:pb-24"
      initial="hidden"
      animate={hasAnimated ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <Card className="relative mx-auto w-full max-w-6xl overflow-hidden border-slate-200 bg-transparent shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <motion.div
            className="flex flex-col justify-between p-6 lg:w-2/5 lg:p-10"
            variants={itemVariants}
          >
            <div>
              <CardHeader className="p-0">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-4xl font-extrabold text-slate-900">
                      {title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base text-slate-600">
                      {description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <motion.div className="mt-6 space-y-4" variants={itemVariants}>
                <div className="flex items-baseline">
                  <span className="text-6xl font-black text-slate-900">
                    {pricePrefix}
                    {price}
                    {priceSuffix}
                  </span>
                  {originalPrice && (
                    <span className="ml-4 text-2xl text-slate-400 line-through">
                      ${originalPrice}
                    </span>
                  )}
                </div>
                <span className="block text-sm text-slate-500">
                  {paymentNote}
                </span>
              </motion.div>
            </div>
            <motion.div className="mt-8" variants={itemVariants}>
              <Button
                className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                size="lg"
                onClick={onButtonClick}
              >
                {buttonText}
              </Button>
            </motion.div>
          </motion.div>
          <Separator className="lg:my-0 lg:self-stretch lg:block lg:h-auto lg:w-px" />
          <motion.div
            className="bg-transparent p-6 lg:w-3/5 lg:p-10"
            variants={itemVariants}
          >
            <div className="space-y-6">
              {features.map((feature, featureIndex) => (
                <div key={featureIndex}>
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">
                    {feature.title}:
                  </h3>
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {feature.items.map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        variants={listItemVariants}
                        custom={index + featureIndex * feature.items.length}
                      >
                        <Check className="mr-3 h-4 w-4 text-slate-900" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  {featureIndex < features.length - 1 && (
                    <Separator className="my-6 bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Card>
    </motion.section>
  )
}
