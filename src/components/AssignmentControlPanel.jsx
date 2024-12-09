import { useEffect, useState } from 'react';
import { ChevronDown, Search, Upload } from 'lucide-react'
import { axiosPrivate } from '@/axios/axios.js';
import { toast } from 'react-toastify';
import SubmissionHeader from '@components/SubmissionHeader.jsx';

export default function AssignmentControlPanel() {
  let [timeFilter, setTimeFilter] = useState('7 ngày tiếp theo')
  let [sortBy, setSortBy] = useState('Sắp xếp theo ngày')
  let [searchQuery, setSearchQuery] = useState('')

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      await axiosPrivate.get(`/assignments/get-top-3`)
          .then((res) => {
            setAssignments(res.data.data);
            console.log(res.data.data);
          })
          .catch((err) => {
            console.log(err);
            toast(err.response.data.message, { type: 'error' });
          });
    }

    fetchAssignments();
  }, []);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mốc thời gian</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>7 ngày tiếp theo</option>
            <option>30 ngày tiếp theo</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option>Sắp xếp theo ngày</option>
            <option>Sắp xếp theo khoá học</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by activity type or name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {assignments.map((assignment) => (
          <SubmissionHeader courseID={assignment.courseId} key={assignment.id} id={assignment.id} title={assignment.title} startDate={assignment.startDate} endDate={assignment.endDate} />
      ))}

      {/*<div className="bg-white rounded-lg shadow overflow-hidden">*/}
      {/*  <div className="p-4 border-b border-gray-200">*/}
      {/*    <h3 className="text-lg font-semibold text-gray-800">Thứ Ba, 1 tháng 10 2024</h3>*/}
      {/*  </div>*/}

      {/*  <div className="p-4 border-b border-gray-200 flex items-start justify-between">*/}
      {/*    <div className="flex items-start">*/}
      {/*      <span className="text-gray-600 mr-4">18:44</span>*/}
      {/*      <Upload className="h-5 w-5 text-gray-400 mr-4 mt-1" />*/}
      {/*      <div>*/}
      {/*        <h6 className="text-blue-600 font-medium">Group Assignment No 04b submission (at home)</h6>*/}
      {/*        <p className="text-sm text-gray-600">Bài tập tới hạn - Kiem thu phan mem_ Nhom 03</p>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*    <a href="/submission">*/}
      {/*      <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">*/}
      {/*        Thêm bài nộp*/}
      {/*      </button>*/}
      {/*    </a>*/}

      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
