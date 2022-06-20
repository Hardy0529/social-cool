import React, { useState } from "react";
import { app } from "../utils/firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Menu, Form, Container, Message } from "semantic-ui-react";

const Singnin = () => {
  const navigate = useNavigate();
  const [activeItem, setAtiveItem] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth(app);

  const onsubmit = () => {
    setIsLoading(true);
    if (activeItem === "register") {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/posts");
          const user = userCredential.user;
          console.log(user);
          setIsLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          switch (errorCode) {
            // 信箱已存在
            case "auth/email-already-in-use":
              setErrorMessage("信箱已存在");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 信箱格式不正確
            case "auth/invalid-email":
              setErrorMessage("信箱格式不正確");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 未啟用「電子郵件/密碼」登入方式
            case "auth/operation-not-allowed":
              setErrorMessage("未啟用「電子郵件/密碼」登入方式");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 密碼強度不足
            case "auth/weak-password":
              setErrorMessage("密碼強度不足");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
          }
          setIsLoading(false);
        });
    } else if (activeItem === "signin") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigate("/posts");
          const user = userCredential.user;
          console.log(user);
          setIsLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          switch (errorCode) {
            // 信箱格式不正確
            case "auth/invalid-email":
              setErrorMessage("信箱格式不正確");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 該 email 已被停用
            case "auth/user-disabled":
              setErrorMessage("EMAIL 已被停用");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 信箱不存在
            case "auth/user-not-found":
              setErrorMessage("信箱不存在");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;

            // 密碼錯誤
            case "auth/wrong-password":
              setErrorMessage("密碼錯誤");
              setTimeout(() => {
                setErrorMessage("");
              }, 4000);
              break;
          }
          setIsLoading(false);
        });
    }
  };
  return (
    <Container>
      <Menu widths="2">
        <Menu.Item
          active={activeItem === "register"}
          onClick={(e) => {
            setErrorMessage("");

            setAtiveItem("register");
          }}
        >
          註冊
        </Menu.Item>
        <Menu.Item
          active={activeItem === "signin"}
          onClick={(e) => {
            setErrorMessage("");

            setAtiveItem("signin");
          }}
        >
          登入
        </Menu.Item>
      </Menu>
      <Form onSubmit={onsubmit}>
        <Form.Input
          label="信箱"
          vlaue={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="請輸入信箱"
          type="email"
        ></Form.Input>
        <Form.Input
          label="密碼"
          vlaue={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="請輸入密碼"
          type="password"
        ></Form.Input>
        {errorMessage && <Message negative>{errorMessage}</Message>}
        <Form.Button loading={isLoading}>
          {activeItem === "register" && "註冊"}
          {activeItem === "signin" && "登入"}
        </Form.Button>
      </Form>
    </Container>
  );
};

export default Singnin;
