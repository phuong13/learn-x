import { Skeleton, Box } from '@mui/material';

const CourseItemSkeleton = () => {
    return (
        <Box className="p-3 mb-2">
            <Skeleton variant="text" height={24} width="80%" />
            <Skeleton variant="text" height={16} width="60%" />
        </Box>
    );
};

export default CourseItemSkeleton;