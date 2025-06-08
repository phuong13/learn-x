import { Card, CardContent, Skeleton, Box } from '@mui/material';

const TopicSkeleton = () => {
    return (
        <Card className="shadow-sm mb-4">
            <CardContent>
                <Box className="flex items-center gap-3 mb-3">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box className="flex-1">
                        <Skeleton variant="text" height={20} width="30%" />
                        <Skeleton variant="text" height={16} width="20%" />
                    </Box>
                </Box>
                <Skeleton variant="text" height={24} width="100%" />
                <Skeleton variant="text" height={24} width="80%" />
                <Skeleton variant="text" height={24} width="60%" />
            </CardContent>
        </Card>
    );
};

export default TopicSkeleton;