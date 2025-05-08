import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import Topic from "./components/tag/Topic";
import { useTopic } from "../../store/useTopic";

const Container = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [topic, setTopic] = useState([]);
  const { forumId } = useParams();
  const { t } = useTranslation();

  const { createTopic, getTopics } = useTopic();

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics(forumId);
      setTopic(data.data);
    };

    fetchTopics();
  }, [forumId]);

  const handleCreateTopic = async () => {
    await createTopic({ content: newTopic, forumId });
    const data = await getTopics(forumId);
    setTopic(data.data);
    setShowPopup(false);
    setNewTopic("");
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {forumId ? (
        <button
          className="border border-primaryDark font-semibold bg-white rounded-lg p-1 hover:bg-slate-300 transition"
          onClick={() => setShowPopup(true)}
        >
          {t('forum.create_topic')}
        </button>
      ) : (
        <p className="text-lg text-center text-gray-500 font-semibold p-1">
          {t('forum.please_select_forum')}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {topic.map((topic) => (
          <Topic
            key={topic.id}
            topicId={topic.id}
            user={topic.account}
            content={topic.content}
            createAt={topic.createdAt}
          />
        ))}
      </div>

      {/* Popup Create Topic */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50  z-30">
          <div className="bg-white p-4 rounded-lg shadow-lg h-[405px] w-[600px]">
            <h2 className="text-lg font-semibold mb-2">{t('forum.new_topic_title')}</h2>
            <textarea
              className="w-full h-[300px] border p-2 rounded-md"
              rows="3"
              placeholder={t('forum.new_topic_placeholder')}
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
            />
            <div className="flex justify-end gap-2 ">
              <button
                 className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors"
                onClick={() => setShowPopup(false)}
              >
                {t('forum.cancel')}
              </button>
              <button
                 className="py-2 px-6 bg-primaryDark text-white rounded-lg  hover:bg-secondary transition-colors"
                 onClick={handleCreateTopic}
              >
                {t('forum.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Container;
