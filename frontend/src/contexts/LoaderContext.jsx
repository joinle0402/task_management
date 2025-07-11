import { createContext, useRef, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const LoaderContext = createContext({});

export function LoaderProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const showLoading = (delay = 0) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (delay > 0) {
            timerRef.current = setTimeout(() => setLoading(true), delay);
        } else {
            setLoading(true);
        }
    };

    const hideLoading = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setLoading(false);
    };

    return <LoaderContext value={{ loading, showLoading, hideLoading }}>{children}</LoaderContext>;
}
