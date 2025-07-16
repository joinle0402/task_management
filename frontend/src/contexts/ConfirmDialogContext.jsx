import ConfirmDialog from '@/components/ConfirmDialog';
import { createContext, useState } from 'react';

export const ConfirmDialogContext = createContext({});

export const ConfirmDialogProvider = ({ children }) => {
    const [dialogOptions, setDialogOptions] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: null,
    });

    const confirm = async ({ title, message }) => {
        return new Promise((resolve) => {
            setDialogOptions({
                open: true,
                title,
                message,
                onConfirm: () => {
                    resolve(true);
                    onClose();
                },
            });
        });
    };

    const onClose = () => setDialogOptions((options) => ({ ...options, open: false }));

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            <ConfirmDialog onClose={onClose} {...dialogOptions} />
        </ConfirmDialogContext.Provider>
    );
};
