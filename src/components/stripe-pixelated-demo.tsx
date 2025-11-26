"use client";
import { PixelatedCanvas } from "@/components/ui/pixalated-canvas";

export default function StripePixelatedDemo() {
    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <PixelatedCanvas
                src="/stripe.png"
                width={330}
                height={150}
                cellSize={4}
                dotScale={0.9}
                shape="circle"
                backgroundColor="#FFFFFF"
                dropoutStrength={0.4}
                interactive
                distortionStrength={3}
                distortionRadius={80}
                distortionMode="swirl"
                followSpeed={0.2}
                jitterStrength={4}
                jitterSpeed={4}
                sampleAverage
                tintColor="#FFFFFF"
                tintStrength={0.3}
                responsive={true}
                className="rounded-2xl"
            />
        </div>
    );
}