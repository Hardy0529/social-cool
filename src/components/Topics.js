import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { firebaseDatabase } from "../utils/firebase";

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");
  useEffect(() => {
    const querySnapshot = getDocs(collection(firebaseDatabase, "topics"));
    querySnapshot.then((topicsData) => {
      const data = topicsData.docs.map((doc) => {
        return doc.data();
      });
      setTopics(data);
    });
  }, []);
  return (
    <List animated selection>
      {topics &&
        topics.map((topic) => (
          <List.Item
            as={Link}
            to={`?topic=${topic.name}`}
            key={topic.name}
            active={topic.name === currentTopic}
          >
            {topic.name}
          </List.Item>
        ))}
    </List>
  );
};

export default Topics;
