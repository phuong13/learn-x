import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useAuth } from '@hooks/useAuth.js';




export const useOutcomesByCourseId = (courseId) => {
    const axiosPrivate = useAxiosPrivate();
    const [outcomes, setOutcomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) return;

        const fetchOutcomes = async () => {
            try {
                const response = await axiosPrivate.get(`/courses/${courseId}/outcomes`);
                setOutcomes(response.data.data || []);
            } catch (err) {
                console.error('Lỗi khi lấy thông tin khóa học:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOutcomes();
    }, [courseId]);

    return { outcomes, loading, error };
}
