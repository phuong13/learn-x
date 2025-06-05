import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { use } from 'react';


export const getAssignment = (assignmentId) => {
    const axiosPrivate = useAxiosPrivate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!assignmentId) return;

        const fetchAssignment = async () => {
            try {
                const response = await axiosPrivate.get(`/assignment-submissions/assignment/${assignmentId}`);
                setAssignment(response.data.data);
            } catch (err) {
                console.error('Error fetching assignment:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [assignmentId]);

    return { assignment, loading, error };
};

export const submitGrade = async (axiosPrivate, assignmentId, studentId, score) => {
    try {
        const response = await axiosPrivate.post(
            `/assignment-submissions/${assignmentId}/${studentId}/score`, 
            { score }
        );
        return { data: response.data, error: null };
    } catch (err) {
        console.error('Error posting grading:', err);
        return { data: null, error: err };
    }
};

