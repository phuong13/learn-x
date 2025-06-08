import { Card, CardContent, Skeleton } from '@mui/material';

const CourseCardSkeleton = () => {
    return (
        <Card className="shadow-sm">
            <Skeleton variant="rectangular" width="100%" height={160} />
            <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
            </CardContent>
        </Card>
    );
};

export default CourseCardSkeleton;