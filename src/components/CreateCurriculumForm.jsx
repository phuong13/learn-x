import React, { useState, useEffect } from 'react';
import {
   Box, Button, Typography, Grid, Card, CardActionArea,
   CardContent, TextField, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FormQuiz from './FormQuiz';
import FormLecture from './FormLecture';
import FormAssignment from './FormAssignment';
import FormResource from './FormResource';
import Tag from './Tag';
import { useSubmitModules } from '../store/useModule';
import { useParams } from 'react-router-dom';
import { Quiz } from '@mui/icons-material';
import Loader from './Loader';


export default function Curriculum({ courseName ,isEdit, onSubmitSuccess, initialModules = [] }) {
   const [modules, setModules] = useState([]);
   const [loading, setLoading] = useState(false);
   const [quizDialog, setQuizDialog] = useState({ open: false, moduleId: null, editData: null });
   const [lectureDialog, setLectureDialog] = useState({ open: false, moduleId: null, editData: null });
   const [assignmentDialog, setAssignmentDialog] = useState({ open: false, moduleId: null, editData: null });
   const [resourceDialog, setResourceDialog] = useState({ open: false, moduleId: null, editData: null });
   const { submitModules } = useSubmitModules();
   const [errors, setErrors] = useState({});

   const { courseId: courseIdParam } = useParams();

   const validateForm = () => {
      const newErrors = {};
      modules.forEach((mod, index) => {
         if (!mod.title.trim()) {
            newErrors[mod.id] = 'Tên chương không được bỏ trống';
         }
      }); setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };
   useEffect(() => {
      setModules(initialModules);
   }, [initialModules]);

   const handleAddChapter = () => {
      const newModule = {
         id: `temp-${Date.now()}`,
         title: '',
         contents: [],
      };
      setModules([...modules, newModule]);
   };

   const handleTitleChange = (id, newTitle) => {
      setModules(prev =>
         prev.map(mod =>
            mod.id === id ? { ...mod, title: newTitle } : mod
         )
      );
   };

   const handleRemoveModule = (id) => {
      setModules(prev => prev.filter(mod => mod.id !== id));
   };

   const handleOptionSelect = (moduleId, type) => {
      if (type === 'quiz') {
         setQuizDialog({ open: true, moduleId, editData: null });
      } else if (type === 'lecture') {
         setLectureDialog({ open: true, moduleId, editData: null });
      } else if (type === 'assignment') {
         setAssignmentDialog({ open: true, moduleId, editData: null });
      }
      else if (type === 'resource') {
         setResourceDialog({ open: true, moduleId, editData: null });
      }

   };


   const handleRemoveContent = (moduleId, contentId) => {
      setModules(prev =>
         prev.map(mod =>
            mod.id === moduleId
               ? { ...mod, contents: mod.contents.filter(c => c.id !== contentId) }
               : mod
         )
      );
   };

   const handleEditContent = (moduleId, item) => {
      if (item.type === 'quiz') {
         setQuizDialog({ open: true, moduleId, editData: item });
      } else if (item.type === 'lecture') {
         setLectureDialog({ open: true, moduleId, editData: item });
      }
      else if (item.type === 'resource') {
         setResourceDialog({ open: true, moduleId, editData: item });
      }
      else if (item.type === 'assignment') {
         setAssignmentDialog({ open: true, moduleId, editData: item });
      }
   };


   const handleAddQuiz = (moduleId, quizData, questionData) => {
      setModules(prev =>
         prev.map(mod =>
            mod.id === moduleId
               ? {
                  ...mod,
                  contents: mod.contents.some(c => c.id === quizData.id)
                     ? mod.contents.map(c =>
                        c.id === quizData.id
                           ? { ...quizData, type: 'quiz', questions: questionData }
                           : c
                     )
                     : [
                        ...mod.contents,
                        {
                           ...quizData,
                           type: 'quiz',
                           id: `temp-${Date.now()}`,
                           questions: questionData,
                        },
                     ],
               }
               : mod
         )
      );
      setQuizDialog({ open: false, moduleId: null, editData: null });
   };


   const handleAddLecture = (moduleId, lectureData) => {
      setModules(prev =>
         prev.map(mod =>
            mod.id === moduleId
               ? {
                  ...mod,
                  contents: mod.contents.some(c => c.id === lectureData.id)
                     ? mod.contents.map(c =>
                        c.id === lectureData.id
                           ? { ...lectureData, type: 'lecture' }
                           : c
                     )
                     : [
                        ...mod.contents,
                        {
                           ...lectureData,
                           id: `temp-${Date.now()}`,
                           type: 'lecture',
                        },
                     ],
               }
               : mod
         )
      );
      setLectureDialog({ open: false, moduleId: null, editData: null });
   };

   const handleAddResource = (moduleId, resourceData) => {
      let parsedResource = {};

      if (resourceData instanceof FormData) {
         const resourceJson = resourceData.get('resources');
         try {
            parsedResource = JSON.parse(resourceJson);
         } catch (err) {
            console.error('Không thể parse resource data:', err);
         }
      } else {
         parsedResource = resourceData;
      }

      const newResource = {
         ...parsedResource,
         resourceData,
         id: `temp-${Date.now()}`,
         type: 'resource',
      };

      setModules(prev =>
         prev.map(mod =>
            mod.id === moduleId
               ? {
                  ...mod,
                  contents: [...mod.contents, newResource],
               }
               : mod
         )
      );

      setResourceDialog({ open: false, moduleId: null, editData: null });
   };


   const handleAddAssignment = (moduleId, assignmenrData) => {
      setModules(prev =>
         prev.map(mod =>
            mod.id === moduleId
               ? {
                  ...mod,
                  contents: mod.contents.some(c => c.id === assignmenrData.id)
                     ? mod.contents.map(c =>
                        c.id === assignmenrData.id
                           ? { ...assignmenrData, type: 'assignment' }
                           : c
                     )
                     : [
                        ...mod.contents,
                        {
                           ...assignmenrData,
                           id: `temp-${Date.now()}`,
                           type: 'assignment',
                        },
                     ],
               }
               : mod
         )
      );
      setAssignmentDialog({ open: false, moduleId: null, editData: null });
   };





   const handleDone = async () => {
      const isValid = validateForm();
      if (!isValid) return;
      const courseInfo = JSON.parse(localStorage.getItem('courseInfo') || '{}');
      const courseId = courseInfo.id ?? courseIdParam;

      if (!courseId) {
         console.error('Course ID is missing');
         return;
      }
      try {
         setLoading(true); 
         const result = await submitModules(modules, courseId);
          if (result.success && onSubmitSuccess) {
         setLoading(false);
         onSubmitSuccess();
      }
      }
      catch (error) {
         console.error('Error submitting modules:', error); 
         setLoading(false);
         return;
      }
     
      
     
   };


   return (
      <Box display="flex" flexDirection="column" gap={2} sx={{ mx: 'auto', width: '100%' }}>
         <Loader isLoading={loading} />
         <div className='ml-10 mt-6 flex flex-col gap-2'>
            {isEdit
               ? <div className='text-slate-700 font-bold text-xl'>Chỉnh sửa nội dung khoá học: {courseName}</div>
               : <div className='text-slate-700 font-bold text-lg'>Tạo nội dung khoá học</div>}

            <button
               type="button"
               onClick={handleAddChapter}
               className="flex ml-6 gap-2 py-2 px-2 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors w-fit"
            >
               <AddIcon />
               Thêm chương
            </button>
         </div>


         {modules.map((module) => (
            <Box
               key={module.id}
               sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  mx: '64px',
                  maxWidth: '100%',
                  bgcolor: '#f9f9f9',
                  position: 'relative',
               }}
            >
               <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <TextField
                     fullWidth
                     label="Tên chương"
                     value={module.title}
                     onChange={(e) => handleTitleChange(module.id, e.target.value)}
                     error={!!errors[module.id]}
                     helperText={errors[module.id]}
                     InputProps={{
                        sx: {
                           fontWeight: 'bold',
                           color: '#334155', // slate-700
                        },
                     }}
                     InputLabelProps={{
                        sx: {
                           color: '#334155', // slate-700
                           fontWeight: 'bold',
                        },
                     }}
                     sx={{ width: '100%' }}
                  />
                  <IconButton color="error" onClick={() => handleRemoveModule(module.id)}>
                     <DeleteIcon />
                  </IconButton>
               </Box>

               {module.contents.length > 0 && (
                  <Box mt={2}>
                     <Typography fontWeight="bold">Nội dung đã thêm:</Typography>
                     <Box display="flex" flexWrap="wrap" gap={1}>
                        {module.contents.map((item) => (
                           <Tag
                              key={item.id}
                              icon={item.type === 'quiz' ? QuizIcon : item.type === 'lecture' ? MenuBookIcon : item.type === 'assignment' ? AssignmentIcon : InsertDriveFileIcon}
                              color={item.type === 'quiz' ? 'primary' : item.type === 'lecture' ? 'secondary' : item.type === 'assignment' ? 'pink-500' : 'rose-600'}
                              label={
                                 item.type === 'quiz'
                                    ? `Quiz: ${item.title || 'Không có tiêu đề'}`
                                    : item.type === 'lecture'
                                       ? `Lecture: ${item.title || 'Không có tiêu đề'}`
                                       : item.type === 'assignment'
                                          ? `Assignment: ${item.title || 'Không có tiêu đề'}`
                                          : item.type === 'resource'
                                             ? `Resource: ${item.title || 'Không có tiêu đề'}`
                                             : ''

                              }
                              onRemove={() => handleRemoveContent(module.id, item.id)}
                              onEdit={() => handleEditContent(module.id, item)}
                           />
                        ))}
                     </Box>
                  </Box>
               )}

               <Grid container spacing={2} mt={1}>
                  <Grid item xs={6} md={3}>
                     <Card onClick={() => handleOptionSelect(module.id, 'lecture')}>
                        <CardActionArea>
                           <CardContent sx={{ textAlign: 'center', padding: '2px' }}>
                              <MenuBookIcon fontSize="large" color="primary" />
                              <Typography variant="subtitle2">Lecture</Typography>
                           </CardContent>
                        </CardActionArea>
                     </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <Card onClick={() => handleOptionSelect(module.id, 'quiz')}>
                        <CardActionArea>
                           <CardContent sx={{ textAlign: 'center', padding: '2px' }}>
                              <QuizIcon fontSize="large" className='text-primary' />
                              <Typography variant="subtitle2">Quiz</Typography>
                           </CardContent>
                        </CardActionArea>
                     </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <Card onClick={() => handleOptionSelect(module.id, 'assignment')}>
                        <CardActionArea>
                           <CardContent sx={{ textAlign: 'center', padding: '2px' }}>
                              <AssignmentIcon fontSize="large" className='text-pink-500' />
                              <Typography variant="subtitle2">Assignment</Typography>
                           </CardContent>
                        </CardActionArea>
                     </Card>
                  </Grid>
                  <Grid item xs={6} md={3}>
                     <Card onClick={() => handleOptionSelect(module.id, 'resource')}>
                        <CardActionArea>
                           <CardContent sx={{ textAlign: 'center', padding: '2px' }}>
                              <InsertDriveFileIcon fontSize="large" className='text-rose-600' />
                              <Typography variant="subtitle2">Resource</Typography>
                           </CardContent>
                        </CardActionArea>
                     </Card>
                  </Grid>
               </Grid>
            </Box>
         ))}

         <FormQuiz
            open={quizDialog.open}
            onClose={() => setQuizDialog({ open: false, moduleId: null, editData: null })}
            onSubmit={(quizData, questionData) =>
               handleAddQuiz(quizDialog.moduleId, quizDialog.editData
                  ? { ...quizDialog.editData, ...quizData }
                  : quizData,
                  questionData
               )
            }
            isEdit={!!quizDialog.editData}
            defaultData={quizDialog.editData}
         />
         <FormLecture
            open={lectureDialog.open}
            onClose={() => setLectureDialog({ open: false, moduleId: null, editData: null })}
            onSubmit={(lectureData) =>
               handleAddLecture(lectureDialog.moduleId, lectureDialog.editData
                  ? { ...lectureDialog.editData, ...lectureData }
                  : lectureData)
            }
            isEdit={!!lectureDialog.editData}
            defaultData={lectureDialog.editData}
         />

         <FormResource
            open={resourceDialog.open}
            onClose={() => setResourceDialog({ open: false, moduleId: null, editData: null })}
            onSubmit={(resourceData) => {
               handleAddResource(resourceDialog.moduleId, resourceDialog.editData
                  ? { ...resourceDialog.editData, ...resourceData }
                  : resourceData)
            }}
            isEdit={!!resourceDialog.editData}
            defaultData={resourceDialog.editData}
         />

         <FormAssignment
            open={assignmentDialog.open}
            onClose={() => setAssignmentDialog({ open: false, moduleId: null, editData: null })}
            onSubmit={(assignmentData) =>
               handleAddAssignment(assignmentDialog.moduleId, assignmentData)
            }
            isEdit={!!assignmentDialog.editData}
            defaultData={assignmentDialog.editData}
         />



         <button
            type="button"
            onClick={handleDone}
            className="flex w-40 justify-center mx-auto gap-2 py-2 px-4 bg-primaryDark text-white rounded-lg hover:bg-secondary transition-colors font-semibold hover:shadow-lg"
         >
            Xong
         </button>
      </Box>
   );
}
