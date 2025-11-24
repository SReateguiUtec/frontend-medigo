
import { Component } from "@/components/ui/testimonials-carousel";

const Carousel = () => {
    return (
        <div className="flex w-full justify-center items-center px-4">
            <div className="w-full max-w-7xl bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 md:p-12">
                <Component />
            </div>
        </div>
    );
};

export default Carousel;