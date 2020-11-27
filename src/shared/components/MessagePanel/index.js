import React, { useEffect, useState, useContext, Suspense } from "react";
import ClassService from "../../../services/ClassService";
import { Context } from "../../Util/context";
import Button from "../../Elements/Button";
import HeaderNav from "../../Elements/HeaderNav";
import TextField from "../../Elements/TextField";
import Loading from "../Loading";
import MessItem from "../Sidebar/MesItem";
import Modal from "../../Elements/Modal";
import AddIcon from "@material-ui/icons/Add";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import CreateClass from "../../../pages/Class/Modal/CreateClass";
import PopupSubject from "../../Util/PopupSubject";
import ModalSubject from "../../Util/ModalSubject";
import "./MessagePanel.scss";
const JoinClass = React.lazy(() =>
  import("../../../pages/Class/Modal/JoinClass")
);
const MessagePanel = ({ loading }) => {
  const [panelMode, setPanelMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [modalMode, setModal] = useState(null);
  const { globalState, dispatch } = useContext(Context);

  const toggleModal = (mode) => {
    if (mode) setModal(mode);
    else setModal(null);
  };
  useEffect(() => {
    ModalSubject.subscribe((data) => {
      switch (data.type) {
        case "CREATE_CLASS":
          toggleModal("create");
          break;
        case "JOIN_CLASS":
          toggleModal("join");
      }
    });
  }, []);
  useEffect(() => {
    if (!loading && searchQuery.length > 0) {
      const time = setTimeout(async () => {
        try {
          const data = await ClassService.findClass(searchQuery);
          setSearchResult(data.data);
        } catch (error) {
          error.response &&
            PopupSubject.next({
              type: "ERROR",
              message: error.response
                ? error.response.data
                : "Some errors occured",
              showTime: 5,
            });
        }
      }, 1000);
      const f = () => {
        clearTimeout(time);
        setSearchResult(null);
      };
      return () => f();
    }
  }, [searchQuery]);
  if (loading) return <Loading />;
  return (
    <div className="messages__panel loading">
      <Suspense
        fallback={
          <Loading
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        }
      >
        <Modal
          open={modalMode}
          onClose={(e) => toggleModal(null)}
          classNames={{ wrapper: "center", content: "form__modal" }}
        >
          {modalMode === "join" && (
            <JoinClass onClose={(e) => toggleModal(null)} />
          )}
          {modalMode === "create" && (
            <CreateClass onClose={(e) => toggleModal(null)} />
          )}
        </Modal>
      </Suspense>
      <div className="sticky">
        <div className="join-or-create">
          {globalState.userData.role !== 0 && (
            <>
              <span>Join Some Classes:</span>
              <Button variant="outlined" onClick={(e) => toggleModal("join")}>
                <EmojiPeopleIcon />
              </Button>
            </>
          )}

          {globalState.userData.role === 0 && (
            <>
              <span>Create Your Class:</span>
              <Button variant="outlined" onClick={(e) => toggleModal("create")}>
                <AddIcon />
              </Button>
            </>
          )}
        </div>
        {Object.keys(globalState.classData).length > 0 && (
          <>
            <HeaderNav
              elements={[
                {
                  onClick: (e) => setPanelMode((prev) => !prev),
                  text: "CLASSES",
                  active: !panelMode,
                },
                {
                  onClick: (e) => setPanelMode((prev) => !prev),
                  text: "CONTACT",
                  active: panelMode,
                },
              ]}
            />
            <div className="user-search">
              <TextField
                onChange={(e) => {
                  const query = e.target.value;
                  setSearchQuery(query);
                }}
                text="Search"
                placeholder="Search"
              />
            </div>
          </>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : searchQuery.length > 0 ? (
        !searchResult ? (
          <Loading className="user-search-loading" />
        ) : searchResult.length > 0 ? (
          <>
            <h4 style={{ textAlign: "center" }}>Search result</h4>
            <div className="messages__list">
              {searchResult.map((r) => (
                <MessItem
                  avatar={r.avatar}
                  path={r.classId}
                  key={r.classId}
                  name={r.name}
                  active={false}
                ></MessItem>
              ))}
            </div>
          </>
        ) : (
          <h4 style={{ textAlign: "center" }}>No result</h4>
        )
      ) : (
        <div className="messages__list">
          {panelMode
            ? Object.values(globalState.classData)
                .filter((classs) => classs.owner == globalState.userData.id)
                .map((filteredClass) => (
                  <MessItem
                    avatar={filteredClass.avatar}
                    path={filteredClass.classId}
                    key={filteredClass.classId}
                    name={filteredClass.name}
                    unread={filteredClass.unread}
                    active={false}
                  ></MessItem>
                ))
            : Object.values(globalState.classData).map((filteredClass) => (
                <MessItem
                  avatar={filteredClass.avatar}
                  path={filteredClass.classId}
                  key={filteredClass.classId}
                  name={filteredClass.name}
                  unread={filteredClass.unread}
                  active={false}
                ></MessItem>
              ))}
        </div>
      )}
    </div>
  );
};

export default MessagePanel;
