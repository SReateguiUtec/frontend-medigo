import { RulerCarousel, type CarouselItem } from "@/components/ui/ruler-carousel";

export function Ruler() {
    const originalItems: CarouselItem[] = [
        { id: 1, title: "Cardiología" },
        { id: 2, title: "Dermatología" },
        { id: 3, title: "Traumatología" },
        { id: 4, title: "Pediatría" },
        { id: 5, title: "Neurología" },
        { id: 6, title: "Oftalmología" },
        { id: 7, title: "Ginecologia" },
        { id: 8, title: "Psicología" },
        { id: 9, title: "Todo." },
    ];
    return (
        <div className="w-full py-20 overflow-hidden flex items-center justify-center">
            <RulerCarousel originalItems={originalItems} />
        </div>
    );
}
