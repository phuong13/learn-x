import { CircularProgress } from '@mui/material';

export const GlobalLoader = () => {
    return (
        <div className="w-full fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center z-50">
            <CircularProgress
                sx={{
                    width: '80px !important',
                    height: '80px !important',
                }}
            />
        </div>
    );
};
