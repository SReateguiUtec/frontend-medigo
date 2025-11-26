import { EncryptedText } from "@/components/ui/encrypted-text";

export function EncryptedTextDemoSecond() {
    return (
        <div className="mx-auto max-w-3xl py-4 text-center">
            <div className="text-xl md:text-5xl font-extrabold tracking-tight text-gray-800">
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
