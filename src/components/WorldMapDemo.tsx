"use client";
import { WorldMap } from "@/components/world-map";

export function WorldMapDemo() {
    return (
        <div className="w-full">
            <div className="max-w-full mx-auto text-center">
            </div>
            <WorldMap
                showLabels={false}
                dots={[
                    {
                        start: {
                            lat: -12.046374,
                            lng: -77.042793
                        },
                        end: {
                            lat: 34.0522,
                            lng: -118.2437
                        },
                    },
                    {
                        start: {
                            lat: 64.2008,
                            lng: -149.4937
                        },
                        end: {
                            lat: 34.0522,
                            lng: -118.2437
                        },
                    },
                    {
                        start: {
                            lat: 64.2008,
                            lng: -149.4937
                        },
                        end: {
                            lat: -15.7975,
                            lng: -47.8919
                        },
                    },
                    {
                        start: {
                            lat: -15.7975,
                            lng: -47.8919
                        },
                        end: {
                            lat: 38.7223,
                            lng: -9.1393
                        },
                    },
                    {
                        start: {
                            lat: 51.5074,
                            lng: -0.1278,
                        },
                        end: {
                            lat: 28.6139,
                            lng: 77.209,
                        },
                    },
                    {
                        start: {
                            lat: 28.6139,
                            lng: 77.209,
                        },
                        end: {
                            lat: 43.1332,
                            lng: 131.9113,
                        },
                    },
                    {
                        start: {
                            lat: 28.6139,
                            lng: 77.209,
                        },
                        end: {
                            lat: -1.2921,
                            lng: 36.8219,
                        },
                    },
                    {
                        start: {
                            lat: 35.6762,
                            lng: 139.6503,
                        },
                        end: {
                            lat: -33.8688,
                            lng: 151.2093,
                        },
                    },
                    {
                        start: {
                            lat: 51.5074,
                            lng: -0.1278,
                        },
                        end: {
                            lat: 35.6762,
                            lng: 139.6503,
                        },
                    },
                ]}
            />
        </div>
    );
}
