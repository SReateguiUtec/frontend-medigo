import { EncryptedText } from "@/components/ui/encrypted-text";

export function EncryptedTextDemoSecond() {
    return (
        <div className="mx-auto max-w-5xl py-4 text-center">
            <div className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-800">
                <EncryptedText
                    text="Conectando pacientes y médicos a través de la tecnología 🚀"
                    encryptedClassName="text-neutral-600"
                    revealedClassName="dark:text-black-600 text-black-600"
                    revealDelayMs={50}
                />
            </div>
        </div>
    );
}
