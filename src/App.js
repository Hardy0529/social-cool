import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./utils/firebase";

// components
import Header from "./components/Header";

// pages
import Singnin from "./pages/Singnin";
import Posts from "./pages/Posts";
import NewPost from "./pages/NewPost";
import Post from "./pages/Post";
import MyPosts from "./pages/MyPosts";
import MyCollections from "./pages/MyCollections";
import MySettings from "./pages/MySettings";

const App = () => {
  const auth = getAuth(app);
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

  return (
    <>
      <Header />

      <Routes>
        <Route path="/post" element={<Posts />} />
        <Route path="/signin" element={<Singnin />} />
        <Route
          path="/new-post"
          element={user ? <NewPost /> : <Navigate to={"/post"} />}
        />
        <Route path="/post/:postId" element={<Post user={user} />} />

        <Route
          path="/my/posts"
          element={user ? <MyPosts /> : <Navigate to={"/post"} />}
        />
        <Route
          path="/my/collections"
          element={user ? <MyCollections /> : <Navigate to={"/post"} />}
        />

        <Route
          path="/my/settings"
          element={
            user ? <MySettings user={user} /> : <Navigate to={"/post"} />
          }
        />
      </Routes>
    </>
  );
};

export default App;
