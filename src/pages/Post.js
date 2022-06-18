import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Container,
  Grid,
  Image,
  Header,
  Segment,
  Icon,
  Comment,
  Form,
} from "semantic-ui-react";
import {
  collection,
  getDocs,
  where,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  writeBatch,
  increment,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import { firebaseDatabase, app } from "../utils/firebase";
import { getAuth, onAuthStateChanged, updateEmail } from "firebase/auth";
import Topics from "../components/Topics";

const Post = ({ user }) => {
  // const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const { postId } = useParams();
  const [commentContent, setCommentContent] = useState("");
  const batch = writeBatch(firebaseDatabase);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [post, setPost] = useState({
    author: {},
  });

  // useEffect(() => {
  //   onAuthStateChanged(auth, (currentUser) => {
  //     if (currentUser) {
  //       console.log(currentUser);
  //       setUser(currentUser);
  //     } else {
  //     }
  //   });
  // }, [user]);

  useEffect(() => {
    const q = query(
      collection(firebaseDatabase, "posts"),
      where("id", "==", postId)
    );
    onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.docs.forEach((doc) => {
        data = doc.data();
      });
      // console.log(data);
      setPost(data);
    });

    // 監聽數據
    // onSnapshot(collection(firebaseDatabase, "posts"), (snapshot) => {
    //   let postData = [];
    //   snapshot.docs.forEach((doc) => {
    //     if (doc.id == postId) {
    //       postData.push({ ...doc.data(), id: doc.id });
    //     }
    //   });
    //   // console.log(postData[0]);
    //   setPost(postData[0]);
    // });
    // setPost({postData[0]});
    // 讀取數據
    // const querySnapshot = getDocs(collection(firebaseDatabase, "posts"));
    // querySnapshot.then((topicsData) => {
    //   const postData = [];
    //   topicsData.docs.forEach((doc) => {
    //     if (doc.id == postId) {
    //       postData.push(doc.data());
    //     }
    //   });
    //   console.log(postData[0]);
    //   setPost(postData[0]);
    // });
  }, []);

  useEffect(() => {
    const colRef = collection(firebaseDatabase, `posts/${postId}/comment`);

    const q = query(colRef, orderBy("createdAt", "desc"));
    onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.docs.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      // console.log(data);
      setComments(data);
    });

    // // 監聽數據
    // onSnapshot(
    //   collection(firebaseDatabase, `posts/${postId}/comment`),
    //   (snapshot) => {
    //     const data = snapshot.docs.map((doc) => {
    //       return { commentData: doc.data(), id: doc.id };
    //     });
    //     console.log(data);
    //     setComments(data);
    //   }
    // );
  }, []);

  const toggle = (isActive, field) => {
    const postRef = doc(firebaseDatabase, "posts", postId);

    updateDoc(postRef, {
      // collectedBy: [user.uid],
      [field]: isActive ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });

    // if (isActive) {
    //   updateDoc(postRef, {
    //     // collectedBy: [user.uid],
    //     [field]: arrayRemove(user.uid),
    //   });
    // } else {
    //   updateDoc(postRef, {
    //     // [field]: [user.uid],
    //     [field]: arrayUnion(user.uid),
    //   });
    // }
  };

  // const toggleCollected = () => {
  //   const washingtonRef = doc(firebaseDatabase, "posts", postId);
  //   if (isCollected) {
  //     updateDoc(washingtonRef, {
  //       // collectedBy: [user.uid],
  //       collectedBy: arrayRemove(user.uid),
  //     });
  //   } else {
  //     updateDoc(washingtonRef, {
  //       // collectedBy: [user.uid],
  //       collectedBy: arrayUnion(user.uid),
  //     });
  //   }
  // };
  // const toggleLiked = () => {
  //   const washingtonRef = doc(firebaseDatabase, "posts", postId);
  //   if (isLiked) {
  //     updateDoc(washingtonRef, {
  //       // likedBy: [user.uid],
  //       likedBy: arrayRemove(user.uid),
  //     });
  //   } else {
  //     updateDoc(washingtonRef, {
  //       // likedBy: [user.uid],
  //       likedBy: arrayUnion(user.uid),
  //     });
  //   }
  // };
  if (user) {
    var isCollected = post.collectedBy?.includes(user.uid);
    var isLiked = post.likedBy?.includes(user.uid);
  }

  // console.log(isCollected);

  const onSubmit = () => {
    setIsLoading(true);
    const sfRef = doc(firebaseDatabase, "posts", postId);
    batch.update(sfRef, { commentContent: increment(1) });

    const nycRef = doc(
      firebaseDatabase,
      `posts/${postId}/comment/`,
      `${Date.now()}`
    );
    // console.log(sfRef);
    batch.set(nycRef, {
      content: commentContent,
      createdAt: serverTimestamp(),
      author: {
        uid: user.uid || null,
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      },
    });

    batch.commit().then(() => {
      setCommentContent("");
      setIsLoading(false);
    });
  };
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}></Grid.Column>
          <Grid.Column width={10}>
            {post.author.photoURL ? (
              <Image src={post.author.photoURL} avatar />
            ) : (
              <Icon name="user circle" />
            )}

            {post.author.displayName || "使用者"}
            <Header>
              {post.title}
              <Header.Subheader>
                {post.topic} ∙ {post.createdAt?.toDate().toLocaleDateString()}
              </Header.Subheader>
            </Header>
            <Image src={post.imageUrl} />
            <Segment basic vertical>
              {post.content}
            </Segment>

            <Segment basic vertical>
              留言 {post.commentContent} ∙ 讚 {post.likedBy?.length || 0}
              {user && (
                <>
                  ∙
                  <Icon
                    name={`thumbs up${isLiked ? "" : " outline"}`}
                    color={isLiked ? "blue" : "grey"}
                    link
                    onClick={() => toggle(isLiked, "likedBy")}
                  />
                  <Icon
                    name={`bookmark${isCollected ? "" : " outline"}`}
                    color={isCollected ? "blue" : "grey"}
                    link
                    onClick={() => toggle(isCollected, "collectedBy")}
                  />
                </>
              )}
            </Segment>
            <Comment.Group>
              {user && (
                <Form reply>
                  <Form.TextArea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <Form.Button onClick={onSubmit} loading={isLoading}>
                    留言
                  </Form.Button>
                </Form>
              )}

              <Header>共 {comments.length || 0} 則留言</Header>
              {comments &&
                comments.map((comment) => {
                  return (
                    <Comment key={comment.id}>
                      <Comment.Avatar src={comment.author.photoURL} />
                      <Comment.Content>
                        <Comment.Author as="span">
                          {comment.author.displayName || "使用者"}
                        </Comment.Author>
                        <Comment.Metadata>
                          {comment.createdAt?.toDate().toLocaleString()}
                          {/* {new Date().toLocaleString()} */}
                        </Comment.Metadata>
                        <Comment.Text>{comment.content}</Comment.Text>
                      </Comment.Content>
                    </Comment>
                  );
                })}
            </Comment.Group>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Post;
