import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDialog({ open, title, message, onClose, onConfirm }) {
    return (
        <Dialog open={open}>
            <DialogTitle>{title || 'Confirm'}</DialogTitle>
            <DialogContent>{message || 'Are you sure?'}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} size="small" variant="contained" color="inherit">
                    Cancel
                </Button>
                <Button onClick={onConfirm} size="small" variant="contained" color="error" autoFocus>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}
