import React, { useEffect, useState } from "react";
import { Grid, Item, Image, Icon, Container, Header } from "semantic-ui-react";
import { app, firebaseDatabase } from "../utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Post from "../components/Post";

// page
import MyMenu from "../components/MyMenu";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const colRef = collection(firebaseDatabase, "posts");
        const q = query(
          colRef,
          where("author.uid", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
          let data = [];
          snapshot.docs.forEach((doc) => {
            data.push(doc.data());
          });
          // console.log(data);
          setPosts(data);
        });
        // const colRef = collection(firebaseDatabase, "posts");
        // const q = query(
        //   collection(firebaseDatabase, "posts"),
        //   where("author.uid", "==", currentUser.uid)
        // );
        // // const q = query(colRef, orderBy("createdAt", "desc"));
        // onSnapshot(q, (snapshot) => {
        //   let data = [];
        //   snapshot.docs.forEach((doc) => {
        //     data.push({ ...doc.data(), id: doc.id });
        //   });
        //   console.log(data);
        //   setPosts(data);
        // });
        // const querySnapshot = getDocs(
        //   query(collection(firebaseDatabase, "posts"), orderBy("createdAt", "desc"))
        // );
        // querySnapshot.then((topicsData) => {
        //   const data = topicsData.docs.map((doc) => doc.data());
        //   console.log(data);
        //   setPosts(data);
        // });

        // const querySnapshot = getDocs(collection(firebaseDatabase, "posts"));
        // querySnapshot.then((topicsData) => {
        //   const data = topicsData.docs.map((doc) => doc.data());

        //   setPosts(data);
        // });
      } else {
      }
    });
  }, []);
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MyMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>我的文章</Header>
            <Item.Group>
              {posts.map((post) => {
                return <Post post={post} key={post.id} />;
              })}
            </Item.Group>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MyPosts;
