import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Topic from "./components/tag/Topic";
import { useTopic } from "../../store/useTopic";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {RippleButton} from "@components/ui/ripple-button.jsx";
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Container = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const { forumId } = useParams();
  const { t } = useTranslation();
  const { createTopic, getTopics } = useTopic();

  const fetchTopics = async () => {
    if (!forumId) return;
    setLoading(true);
    try {
      const res = await getTopics(forumId);
      setTopics(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách topics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [forumId]);

  const handleCreateTopic = async () => {
    if (!newTopic.trim() || !forumId) return;
    setLoadingCreate(true);
    try {
      await createTopic({ content: newTopic, forumId });
      await fetchTopics();
      setShowPopup(false);
      setNewTopic("");
    } catch (err) {
      console.error("Lỗi khi tạo topic:", err);
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full focus:outline-none" tabIndex={-1}>
      {forumId ? (
        <RippleButton
                   onClick={() => setShowPopup(true)}

        >
          {t("forum.create_topic")}
        </RippleButton>
      ) : (
        <div className="text-lg text-center text-slate-600 font-semibold pt-6 h-full bg-white rounded-lg shadow-md">
          {t("forum.please_select_forum")}
        </div>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : topics.length > 0 && forumId ? (
        <div className="flex flex-col gap-4 h-full bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          {topics.map((topic) => (
            <Topic
              key={topic.id}
              topicId={topic.id}
              user={topic.account}
              content={topic.content}
              createAt={topic.createdAt}
            />
          ))}
        </div>
      ) : (
        forumId && (
          <div className="text-center mt-6 text-slate-600 font-semibold">
            {t("forum.no_topics")}
          </div>
        )
      )}

      {/* Modal Create Topic */}
      <Modal
        open={showPopup}
        onClose={() => setShowPopup(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {t("forum.new_topic_title")}
          </Typography>
          <ReactQuill
            theme="snow"
            value={newTopic}
            onChange={setNewTopic}
            style={{ height: 200, marginBottom: 52 }}
            placeholder={t("forum.new_topic_placeholder")}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowPopup(false)}
              sx={{ borderRadius: 2 }}
              disabled={loadingCreate}
            >
              {t("forum.cancel")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTopic}
              sx={{ borderRadius: 2 }}
              disabled={loadingCreate}
            >
              {loadingCreate ? <CircularProgress size={20} color="inherit" /> : t("forum.submit")}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Container;