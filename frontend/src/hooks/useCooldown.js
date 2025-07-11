import { useEffect, useState } from 'react';

export function useCooldown(storageKey, durationMs) {
    const [cooldownExpiresAt, setCooldownExpiresAt] = useState(null);
    const cooldown = cooldownExpiresAt ? Math.ceil((cooldownExpiresAt - Date.now()) / 1000) : 0;
    const cooldownActive = cooldown > 0;

    useEffect(() => {
        const storageCooldownExpiresAt = localStorage.getItem(storageKey);
        if (storageCooldownExpiresAt) {
            const expiresAt = parseInt(storageCooldownExpiresAt, 10);
            if (expiresAt > Date.now()) {
                setCooldownExpiresAt(expiresAt);
            } else {
                localStorage.removeItem(storageKey);
            }
        }
    }, [storageKey]);

    function startCooldown() {
        const time = Date.now() + durationMs;
        localStorage.setItem(storageKey, time.toString());
        setCooldownExpiresAt(time);
    }

    return { startCooldown, cooldownActive, cooldown };
}
