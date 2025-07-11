import { useEffect, useState } from 'react';

export function useCountdown(countdownAt = null) {
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (!countdownAt) return;

        function OnCountDown() {
            const targetDate = new Date(countdownAt);
            const diffTime = targetDate - new Date();
            setCountdown(diffTime > 0 ? diffTime : 0);
        }

        OnCountDown();

        const intervalId = setInterval(OnCountDown, 1000);

        return () => clearInterval(intervalId);
    }, [countdownAt]);

    const minutes = Math.floor(countdown / 1000 / 60);
    const seconds = Math.floor((countdown / 1000) % 60);
    const expired = countdown <= 0;
    const formatted = expired ? '' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
        minutes,
        seconds,
        expired,
        formatted,
    };
}
