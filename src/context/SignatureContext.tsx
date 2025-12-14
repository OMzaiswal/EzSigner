import { createContext, useContext, useState } from "react";

type SignatureContextType = {
    signatureUrl: string | null;
    setSignatureUrl: (url: string | null) => void;
}

const SignatureContext = createContext<SignatureContextType | null>(null);

export const SignatureProvider = ({ children }: { children: React.ReactNode }) => {

    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

    return (
        <SignatureContext.Provider value={{ signatureUrl, setSignatureUrl }}>
            {children}
        </SignatureContext.Provider>
    )
}

export const useSignature = () => {
    const ctx = useContext(SignatureContext);
    if (!ctx) throw new Error('useSignature must be used inside SignatureProvider');
    return ctx;
};