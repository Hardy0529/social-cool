import React, { useState, useEffect } from "react";
import { Container, Header, Form, Image, Button } from "semantic-ui-react";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app, firebaseDatabase, storage } from "../utils/firebase";

const NewPost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    const querySnapshot = getDocs(collection(firebaseDatabase, "topics"));
    querySnapshot.then((topicsData) => {
      const data = topicsData.docs.map((doc) => {
        return doc.data();
      });
      //   console.log(data);
      setTopics(data);
    });
  }, []);

  const options = topics.map((topic) => {
    return {
      key: topic.name,
      text: topic.name,
      value: topic.name,
    };
  });

  const onsubmit = () => {
    setIsLoading(true);

    if (!title || !content || !topics || !topicName || !file) {
      alert("必填字段不能为空");

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      const storageRef = ref(storage, `post-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newPostRef = doc(collection(firebaseDatabase, "posts"));
            setDoc(newPostRef, {
              id: newPostRef.id,
              title,
              content,
              topic: topicName,
              createdAt: serverTimestamp(),
              imageUrl: downloadURL,
              author: {
                displayName: user.displayName || "",
                photoURL: user.photoURL || "",
                uid: user.uid,
                email: user.email,
              },
            }).then(() => {
              navigate("/");
              setIsLoading(false);
            });
          });
        }
      );
    }
  };

  return (
    <Container>
      <Header>發表文章</Header>
      <Form onSubmit={onsubmit}>
        <Image
          src={
            file
              ? URL.createObjectURL(file)
              : "https://react.semantic-ui.com/images/wireframe/image.png"
          }
          size="small"
          floated="left"
        />
        <Button as="label" htmlFor="post-image" basic>
          上傳文章圖片
        </Button>
        <Form.Input
          type="file"
          id="post-image"
          style={{ display: `none` }}
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Form.Input
          vlaue={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="輸入文章標題"
        />
        <Form.TextArea
          vlaue={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入文章內容"
        />

        <Form.Dropdown
          placeholder="輸入文章主題"
          options={options}
          value={topicName}
          onChange={(e, { value }) => setTopicName(value)}
          selection
        />

        <Form.Button loading={isLoading}>送出</Form.Button>
      </Form>
    </Container>
  );
};

export default NewPost;
