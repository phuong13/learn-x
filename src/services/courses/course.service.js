import { axiosPrivate } from '../../axios/axios';
const BASE_AUTH_URL = '/courses';

class CourseService {
    static async getMyCourses(role, pageable) {
        if (role === 'TEACHER') {
            const response = await axiosPrivate
                .get(`${BASE_AUTH_URL}/teacher/my-courses?page=${pageable.page}&size=${pageable.size}`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((res) => {
                    return res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            return response;
        } else {
            const response = await axiosPrivate
                .get(`${BASE_AUTH_URL}/my-courses?page=${pageable.page}&size=${pageable.size}`, {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then((res) => {
                    return res.data.data;
                })
                .catch((err) => {
                    console.log(err);
                });
            return response;
        }
    }
}

export default CourseService;
