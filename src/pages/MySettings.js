import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Header,
  Button,
  Segment,
  Modal,
  Input,
  Image,
} from "semantic-ui-react";
import { getAuth, updateProfile } from "firebase/auth";
import { app, firebaseDatabase, storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// page
import MyMenu from "../components/MyMenu";

const MyName = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isLoading, seIsLoading] = useState(false);
  const auth = getAuth(app);

  const onSubmit = () => {
    seIsLoading(true);
    updateProfile(auth.currentUser, {
      displayName,
    })
      .then(() => {
        setDisplayName("");
        setIsModalOpen(false);
        seIsLoading(false);
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };
  return (
    <>
      <Header size="small">
        會員名稱
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>{user.displayName}</Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員名稱</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="輸入新的會員名稱"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button loading={isLoading} onClick={onSubmit}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const MyPhoto = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, seIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const previewImageUrl = file ? URL.createObjectURL(file) : user.photoURL;
  const auth = getAuth(app);

  const onSubmit = () => {
    seIsLoading(true);
    const storageRef = ref(storage, `user-photos/${user.uid}`);
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
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          })
            .then(() => {
              seIsLoading(false);
              setFile(null);
              setIsModalOpen(false);
            })
            .catch((error) => {
              // An error occurred
              // ...
            });
        });
      }
    );
  };
  return (
    <>
      <Header size="small">
        會員照片
        <Button floated="right" onClick={() => setIsModalOpen(true)}>
          修改
        </Button>
      </Header>
      <Segment vertical>
        <Image src={user.photoURL} avatar wrapped />
      </Segment>
      <Modal open={isModalOpen} size="mini">
        <Modal.Header>修改會員圖片</Modal.Header>
        <Modal.Content image>
          <Image src={previewImageUrl} avatar wrapped />
          <Modal.Description>
            <Button as="label" htmlFor="post-image">
              上傳
            </Button>
            <Input
              type="file"
              id="post-image"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setIsModalOpen(false)}>取消</Button>
          <Button loading={isLoading} onClick={onSubmit}>
            修改
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const MySettings = ({ user }) => {
  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={3}>
            <MyMenu />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header>會員資料</Header>
            <MyName user={user} />
            <MyPhoto user={user} />

            <Header size="small">
              會員密碼
              <Button floated="right">修改</Button>
            </Header>
            <Segment vertical>********</Segment>
          </Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default MySettings;
