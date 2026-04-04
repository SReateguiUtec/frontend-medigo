import { EncryptedText } from "@/components/ui/encrypted-text";

export function EncryptedTextDemoSecond() {
    return (
        <p className="mx-auto max-w-lg py-10 text-left">
            <EncryptedText
                text="En MediGO te cuidamos con alma"
                encryptedClassName="text-neutral-500"
                revealedClassName="font-semibold text-indigo-700"
                revealDelayMs={50}
            />
        </p>
    );
}
