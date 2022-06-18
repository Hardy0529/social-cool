import React from "react";

import { Item, Image, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const post = ({ post, user }) => {
  return (
    <Item as={Link} to={`/post/${post.id}`}>
      <Item.Image
        src={
          post.imageUrl ||
          "https://react.semantic-ui.com/images/wireframe/image.png"
        }
      />

      <Item.Content>
        <Item.Meta>
          {post.author.photoURL ? (
            <Image src={post.author.photoURL} avatar />
          ) : (
            <Icon name="user circle" />
          )}
          {"  "}
          {post.topic} ∙ {post.author.displayName || "使用者"}
        </Item.Meta>
        <Item.Header>{post.title}</Item.Header>
        <Item.Description>{post.Content}</Item.Description>

        <Item.Extra>
          留言 {post.commentContent || 0} ∙ 讚 {post.likedBy?.length || 0}
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default post;
