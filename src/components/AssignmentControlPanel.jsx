import { useEffect, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react'
import { axiosPrivate } from '@/axios/axios.js';
import { toast } from 'react-toastify';
import SubmissionHeader from '@components/SubmissionHeader.jsx';
import { t } from 'i18next';
import QuizzHeader from './QuizzHeader';

export default function AssignmentControlPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('this'); // 'this' = tháng này, 'next' = tháng sau
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      const date = new Date();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      if (timeFilter === 'next') {
        month += 1;
        if (month > 12) {
          month = 1;
          year += 1;
        }
      }

      const urlParams = new URLSearchParams();
      urlParams.append('month', month.toString());
      urlParams.append('year', year.toString());
      const url = `/dashboard/get-by-month-year?${urlParams.toString()}`;
      await axiosPrivate.get(url)

        .then((res) => {
          setAssignments(res.data.data.assignments);
          setQuizzes(res.data.data.quizzes);
        })
        .catch((err) => {
          toast(err.response.data.message, { type: 'error' });
        });
    };

    fetchAssignments();
  }, [timeFilter]);

  // Filter assignments and quizzes by searchQuery
  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white m-4 px-6 py-2  rounded-md">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">{t('time')}</h2>
      <div className="flex flex-wrap gap-4 mb-2">
        <div className="relative">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="appearance-none bg-white border border-slate-400 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-1 focus:ring-primaryDark focus:border-primaryDark"
          >
            <option value="this">Tháng này</option>
            <option value="next">Tháng tiếp theo</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by activity type or name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-400 rounded-md py-2 pl-10 pr-3 text-sm leading-5 focus:outline-none focus:ring-1 focus:ring-primaryDark focus:border-primaryDark"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {filteredAssignments.map((assignment) => (
        <SubmissionHeader
          courseID={assignment.courseId}
          key={assignment.id}
          id={assignment.id}
          title={`${assignment.courseName} - ${assignment.title}`}
          startDate={assignment.startDate}
          endDate={assignment.endDate}
        />
      ))}

      {filteredQuizzes.map((quiz) => (
        <QuizzHeader
          courseID={quiz.courseId}
          key={quiz.id}
          id={quiz.id}
          title={`${quiz.courseName} - ${quiz.title}`}
          startDate={quiz.startDate}
          endDate={quiz.endDate}
        />
      ))}

    </div>
  )
}