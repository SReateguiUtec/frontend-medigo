"use client";
import { PixelatedCanvas } from "@/components/ui/pixalated-canvas";

export default function PixelatedCanvasDemo() {
    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <PixelatedCanvas
                src="/dailyco.png"
                width={350}
                height={400}
                cellSize={4}
                dotScale={0.9}
                shape="circle"
                backgroundColor="#000000"
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
                tintStrength={0.05}
                responsive={true}
                className="rounded-2xl border border-neutral-800 shadow-lg w-full h-full max-w-full"
            />
        </div>
    );
}