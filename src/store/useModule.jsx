import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { convertUTCToLocal, parseJavaLocalDateTime } from '../utils/date';
const typeToEndpoint = {
  lecture: "lectures",
  quiz: "quizzes",
  assignment: "assignments",
  resource: "resources",
};


export const useSubmitModules = () => {
  const axiosPrivate = useAxiosPrivate();

  const submitModules = async (modules, courseId) => {
    try {
      const res = await getModules(courseId);
      if (!res.success) {
        return { success: false };
      }

      const oldModules = res.modules || [];

      const oldModuleMap = new Map();
      oldModules.forEach((m) => oldModuleMap.set(m.id, m));

      const currentModuleIds = [];

      for (const module of modules) {
        let moduleId = module.id;
        const isNewModule = !moduleId || String(moduleId).startsWith("temp-");

        // === MODULE ===
        if (isNewModule) {
          const res = await axiosPrivate.post("/modules", {
            name: module.title,
            courseId,
          });
          moduleId = res.data.data.id;
        } else {
          const old = oldModuleMap.get(moduleId);
          if (old && old.title !== module.title) {
            await axiosPrivate.patch(`/modules/${moduleId}`, {
              name: module.title,
            });
          }
        }


        currentModuleIds.push(moduleId);
        const oldModule = oldModuleMap.get(moduleId);
        const currentContentIds = [];


        if (Array.isArray(module.contents) && module.contents.length > 0) {
          for (const item of module.contents) {

            let contentId = item.id;
            const isNewContent = !contentId || String(contentId).startsWith("temp-");

            if (item.type === "lecture") {
              const payload = {
                title: item.title,
                content: item.content || "",
                moduleId,
              };

              if (isNewContent) {
                const res = await axiosPrivate.post("/lectures", payload);
                contentId = res.data.data.id;
              } else {
                const old = oldModule?.contents?.find(
                  (c) => c.id === contentId && c.type === 'lecture'
                );
                if (!old || old.title !== item.title || old.content !== item.content) {
                  await axiosPrivate.patch(`/lectures/${contentId}`, payload);
                }
              }
              currentContentIds.push(contentId);

            }

            else if (item.type === "quiz") {
              let quizId = item.id;
              const isNewQuiz = !quizId || String(quizId).startsWith("temp-");

              const postPayload = {
                title: item.title,
                description: item.description || "",
                startDate: convertUTCToLocal(item.startDate),
                endDate: convertUTCToLocal(item.endDate),
                timeLimit: Number(item.timeLimit || 0),
                shuffled: item.shuffled || false,
              };

              const patchPayload = {
                ...postPayload,
                attemptAllowed: item.attemptAllowed || 0,
              };

              if (isNewQuiz) {
                const res = await axiosPrivate.post("/quizzes", {
                  ...postPayload, attemptAllowed: item.attemptAllowed || 0, moduleId,

                });
                quizId = res.data.data.id;
                item.id = quizId;
              } else {
                const old = oldModule?.contents?.find(
                  (q) => q.id === quizId && q.type === 'quiz'
                );

                const hasChanges =
                  !old ||
                  old.title !== item.title ||
                  old.description !== item.description ||
                  old.startDate !== item.startDate ||
                  old.endDate !== item.endDate ||
                  old.attemptAllowed !== patchPayload.attemptAllowed ||
                  old.timeLimit !== patchPayload.timeLimit ||
                  old.shuffled !== patchPayload.shuffled;

                if (hasChanges) {
                  await axiosPrivate.patch(`/quizzes/${quizId}`, patchPayload);
                }
              }



              const oldQuestions = oldModule?.contents
                ?.find((item) => item.id === quizId && item.type === 'quiz')
                ?.questions || [];
              const oldQuestionIds = oldQuestions.map((q) => q.id);
              const currentQuestionIds = [];

              for (const q of item.questions) {
                const isNewquestion = !q.id || String(q.id).startsWith("temp-");
                const endpoint =
                  q.type === "single"
                    ? "scq"
                    : q.type === "multiple"
                      ? "mcq"
                      : q.type === "truefalse"
                        ? "tfq"
                        : "fitb";
                const url = `/question-quizzes/${endpoint}`;
                const questionPayload = {
                  content: q.content || "",
                  quizId,
                  options: q.options,
                  ...(q.type === "fitb" ? { answerContent: q.answerContent } : {}),
                  ...(q.type === "multiple" ? { answers: q.answer } : { answer: q.answer }),
                };

                if (isNewquestion) {
                  const res = await axiosPrivate.post(url, questionPayload);
                  currentQuestionIds.push(res.data.data.id);
                } else {
                  currentQuestionIds.push(q.id);
                  await axiosPrivate.patch(`${url}/${q.id}`, questionPayload);
                }
              }

              for (const oldQId of oldQuestionIds) {
                if (!currentQuestionIds.includes(oldQId)) {
                  await axiosPrivate.delete(`/question-quizzes/${oldQId}`);
                }
              }
              currentContentIds.push(contentId);

            }

            else if (item.type === "assignment") {
              const payload = {
                title: item.title,
                content: item.content || "",
                state: item.state || "OPEN",
                startDate: convertUTCToLocal(item.startDate),
                endDate: convertUTCToLocal(item.endDate),
                moduleId,
              };

              if (isNewContent) {
                const res = await axiosPrivate.post("/assignments", payload);
                contentId = res.data.data.id;
              } else {
                const old = oldModule?.contents?.find(
                  (a) => a.id === contentId && a.type === 'assignment'
                );

                if (!old || old.title !== item.title || old.content !== item.content) {
                  await axiosPrivate.patch(`/assignments/${contentId}`, payload);
                }
              }
              currentContentIds.push(contentId);
            }

            else if (item.type === "resource") {

              const formData = item.resourceData;

              // Trường hợp có FormData: tạo mới hoặc cập nhật có file
              if (formData instanceof FormData) {
                for (const [key, value] of formData.entries()) {
                  console.log(`${key}:`, value);
                }

                const resourcesRaw = formData.get("resources");

                let resourcesJson;
                try {
                  if (resourcesRaw instanceof Blob) {
                    const text = await resourcesRaw.text();
                    resourcesJson = JSON.parse(text);
                  } else {
                    resourcesJson = JSON.parse(resourcesRaw);
                  }
                } catch (err) {
                  console.error("❌ Lỗi khi parse JSON từ 'resources':", err);
                  return;
                }

                // Thêm moduleId
                resourcesJson.moduleId = moduleId;

                // Ghi đè lại 'resources' trong FormData
                formData.set(
                  "resources",
                  new Blob([JSON.stringify(resourcesJson)], { type: "application/json" })
                );

                try {
                  let res;
                  if (isNewContent) {
                    res = await axiosPrivate.post("/resources", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                    contentId = res.data?.data?.id;
                  } else {
                    res = await axiosPrivate.patch(`/resources/${contentId}`, formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                    });
                  }

                  if (contentId && !String(contentId).startsWith("temp-")) {
                    currentContentIds.push(contentId);
                  }
                } catch (err) {
                  console.error("❌ Lỗi khi gửi FormData:", err);
                }
              }

              // Trường hợp KHÔNG có FormData (chỉ PATCH file link dạng text)
              else if (!isNewContent) {
                try {
                  const payload = {
                    file: item.urlDocument,
                  };

                  await axiosPrivate.patch(`/resources/${contentId}`, payload);
                  if (contentId && !String(contentId).startsWith("temp-")) {
                    currentContentIds.push(contentId);
                  }
                } catch (err) {
                  console.error("❌ Lỗi khi PATCH resource không có FormData:", err);
                }
              }
            }



          }
        }
        // DELETE CONTENT
        if (oldModule) {

          const allOld = (oldModule.contents || []).map((item) => ({
            id: item.id,
            type: item.type, // sẽ là "lecture", "quiz", "assignment", "resource"
          }));

          for (const old of allOld) {
            if (!currentContentIds.includes(old.id)) {
              const endpoint = typeToEndpoint[old.type];
              if (endpoint) {
                await axiosPrivate.delete(`/${endpoint}/${old.id}`);
              }
            }
          }

        }
      }

      // DELETE MODULE
      for (const oldModule of oldModules) {
        if (!currentModuleIds.includes(oldModule.id)) {
          await axiosPrivate.delete(`/modules/${oldModule.id}`);
        }
      }

      return { success: true };
    } catch (error) {
      console.error("❌ submitModules error:", error);
      return { success: false };
    }
  };

  const getModules = async (courseId) => {
    try {
      const response = await axiosPrivate.get(`/courses/${courseId}/modules`);
      const modulesData = response.data.data;

      const formattedModules = await Promise.all(
        modulesData.map(async (module) => {
          const [lecturesRes, resourcesRes, assignmentsRes, quizzesRes] = await Promise.all([
            axiosPrivate.get(`/modules/${module.id}/lectures`),
            axiosPrivate.get(`/modules/${module.id}/resources`),
            axiosPrivate.get(`/modules/${module.id}/assignments`),
            axiosPrivate.get(`/modules/${module.id}/quizzes`),
          ]);

          const lectures = lecturesRes.data.data.map((lecture) => ({
            ...lecture,
            type: 'lecture',
          }));

          const resources = resourcesRes.data.data.map((res) => ({
            ...res,
            type: 'resource',
          }));

          const assignments = assignmentsRes.data.data.map((asmt) => ({
            ...asmt,
            type: 'assignment',
          }));

          const quizzes = await Promise.all(
            quizzesRes.data.data.map(async (quiz) => {
              const questionsRes = await axiosPrivate.get(`/quizzes/${quiz.id}/questions`);
              return {
                ...quiz,
                type: 'quiz',
                questions: questionsRes.data.data,
              };
            })
          );

          const combinedContents = [...lectures, ...resources, ...assignments, ...quizzes];
          combinedContents.sort((a, b) => {
            const dateA = parseJavaLocalDateTime(a.createdAt);
            const dateB = parseJavaLocalDateTime(b.createdAt)
            return dateA - dateB;
          });

          return {
            id: module.id,
            title: module.name,
            contents: combinedContents,
          };

        })
      );
      return { success: true, modules: formattedModules };
    } catch (error) {
      console.error(error);
      return { success: false, modules: [] };
    }
  };

  return { submitModules, getModules };
};
