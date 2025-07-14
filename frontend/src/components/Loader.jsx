import { use } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { LoaderContext } from '@/contexts/LoaderContext.jsx';

export default function Loader() {
    const { loading } = use(LoaderContext);
    return (
        <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
