import React, { useEffect, useState, useRef } from "react";
import { Grid, Item, Image, Icon, Container } from "semantic-ui-react";
import { firebaseDatabase, app } from "../utils/firebase";
import { Waypoint } from "react-waypoint";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  onSnapshot,
  limit,
  startAfter,
} from "firebase/firestore";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link, useLocation } from "react-router-dom";
import Post from "../components/Post";

// page
import Topics from "../components/Topics";

const Posts = () => {
  const location = useLocation();
  const urlSearchParams = new URLSearchParams(location.search);
  const currentTopic = urlSearchParams.get("topic");
  const lastPostSnapshotRef = useRef();
  const auth = getAuth(app);
  console.log(currentTopic);
  const [posts, setPosts] = useState();

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        setUser(currentUser);
      } else {
      }
    });
  }, []);

  useEffect(() => {
    if (currentTopic) {
      const colRef = collection(firebaseDatabase, "posts");
      const q = query(
        colRef,
        where("topic", "==", currentTopic),
        orderBy("createdAt", "desc"),

        limit(6)
      );
      onSnapshot(q, (snapshot) => {
        let data = [];
        snapshot.docs.forEach((doc) => {
          data.push(doc.data());
        });
        // console.log(data);
        lastPostSnapshotRef.current = snapshot.docs[snapshot.docs.length - 1];

        console.log(lastPostSnapshotRef.current);
        setPosts(data);
      });
    } else {
      const q = query(
        collection(firebaseDatabase, "posts"),

        orderBy("createdAt", "desc"),
        limit(6)
      );
      onSnapshot(q, (snapshot) => {
        let data = [];
        snapshot.docs.forEach((doc) => {
          data.push(doc.data());
          // data = doc.data();
        });

        lastPostSnapshotRef.current = snapshot.docs[snapshot.docs.length - 1];

        console.log(lastPostSnapshotRef.current);
        setPosts(data);
      });
    }

    // const querySnapshot = getDocs(
    //   query(
    //     collection(firebaseDatabase, "posts"),
    //     where("topic", "==", currentTopic),
    //     orderBy("createdAt", "desc")
    //   )
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
  }, [currentTopic]);
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <Topics />
          </Grid.Column>
          <Grid.Column width={10}>
            <Item.Group>
              {posts &&
                posts.map((post) => {
                  return <Post post={post} user={user} key={post.id} />;
                })}
            </Item.Group>
            <Waypoint
              onEnter={() => {
                if (lastPostSnapshotRef.current) {
                  if (currentTopic) {
                    const colRef = collection(firebaseDatabase, "posts");
                    const q = query(
                      colRef,
                      where("topic", "==", currentTopic),

                      orderBy("createdAt", "desc"),
                      startAfter(lastPostSnapshotRef.current),
                      limit(2)
                    );
                    onSnapshot(q, (snapshot) => {
                      let data = [];
                      snapshot.docs.forEach((doc) => {
                        data.push(doc.data());
                      });
                      lastPostSnapshotRef.current =
                        snapshot.docs[snapshot.docs.length - 1];
                      setPosts([...posts, ...data]);
                    });
                  } else {
                    const q = query(
                      collection(firebaseDatabase, "posts"),

                      orderBy("createdAt", "desc"),
                      startAfter(lastPostSnapshotRef.current),
                      limit(2)
                    );
                    onSnapshot(q, (snapshot) => {
                      let data = [];
                      snapshot.docs.forEach((doc) => {
                        data.push(doc.data());
                        // data = doc.data();
                      });
                      lastPostSnapshotRef.current =
                        snapshot.docs[snapshot.docs.length - 1];
                      setPosts([...posts, ...data]);
                    });
                  }
                }
              }}
            />
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Posts;
