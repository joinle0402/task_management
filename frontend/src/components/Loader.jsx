import { use } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoaderContext } from '@/contexts/LoaderContext.jsx';

export default function Loader({ isLoading = false }) {
    const { loading } = use(LoaderContext);
    return (
        <Backdrop open={loading || isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
