import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

const MyMenu = () => {
  const location = useLocation();
  const menuItmes = [
    { name: "我的文章", path: "/my/posts" },
    { name: "我的收藏", path: "/my/collections" },
    { name: "會員資料", path: "/my/settings" },
  ];

  return (
    <List animated selection>
      {menuItmes &&
        menuItmes.map((menuItme) => (
          <List.Item
            active={menuItme.path === location.pathname}
            as={Link}
            to={menuItme.path}
            key={menuItme.name}
          >
            {menuItme.name}
          </List.Item>
        ))}
    </List>
  );
};

export default MyMenu;
