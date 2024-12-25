import { axiosPrivate } from '@/axios/axios.js';

const BASE_URL = '/modules';

class ModuleService {
    static async getLecturesByModuleId(moduleId) {
        return await axiosPrivate
            .get(`${BASE_URL}/${moduleId}/lectures`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getResourcesByModuleId(moduleId) {
        return await axiosPrivate
            .get(`${BASE_URL}/${moduleId}/resources`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getAssignmentsByModuleId(moduleId) {
        return await axiosPrivate
            .get(`${BASE_URL}/${moduleId}/assignments`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getAllAssignmentsByModuleId(moduleId) {
        return await axiosPrivate
            .get(`${BASE_URL}/${moduleId}/assignments`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getAssignmentById(assignmentId) {
        return await axiosPrivate
            .get(`${BASE_URL}/assignments/${assignmentId}`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    static async getAssignmentSubmissions(assignmentId) {
        return await axiosPrivate
            .get(`/assignment-submissions/assignment/${assignmentId}`, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                return res.data.data;
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export default ModuleService;
