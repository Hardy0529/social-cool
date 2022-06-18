import React, { useEffect, useState } from "react";
import { Menu, Search } from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../utils/firebase";
import algolia from "../utils/algolia";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const auth = getAuth(app);
  const [inputValue, setInputValue] = useState("");
  const [results, setresults] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
      }
    });
  }, []);

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onSearchChange = (e, { value }) => {
    setInputValue(value);
    algolia.search(value).then((result) => {
      const searchResults = result.hits.map((hit) => {
        return {
          title: hit.title,
          description: hit.content,
          id: hit.objectID,
        };
      });
      setresults(searchResults);
    });
  };
  const onResultSelect = (e, { result }) => {
    navigate(`/post/${result.id}`);
  };

  return (
    <Menu>
      <Menu.Item as={Link} to="/">
        Social Cool
      </Menu.Item>
      <Menu.Item>
        <Search
          value={inputValue}
          onSearchChange={onSearchChange}
          results={results}
          noResultsMessage="找不到相關文章"
          onResultSelect={onResultSelect}
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {user ? (
          <>
            <Menu.Item as={Link} to="/new-post">
              發表文章
            </Menu.Item>
            <Menu.Item as={Link} to="/my/posts">
              會員
            </Menu.Item>
            <Menu.Item onClick={logOut}>登出</Menu.Item>
          </>
        ) : (
          <Menu.Item as={Link} to="/signin">
            註冊／登入
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
