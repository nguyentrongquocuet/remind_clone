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
import "./MessagePanel.scss";
const JoinClass = React.lazy(() =>
  import("../../../pages/Class/Modal/JoinClass")
);
const MessagePanel = ({ loading }) => {
  console.log("PANEL REINE");
  const [panelMode, setPanelMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [modalMode, setModal] = useState(null);
  const toggleModal = (mode) => {
    if (mode) setModal(mode);
    else setModal(null);
  };
  // const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!loading && searchQuery.length > 0) {
      // setSearching(true);
      const time = setTimeout(async () => {
        try {
          const data = await ClassService.findClass(
            searchQuery,
            globalState.token
          );
          setSearchResult(data.data);
          // setSearching(false);
        } catch (error) {
          console.log(error);
        }
      }, 1000);
      const f = () => {
        // setSearching(false);
        clearTimeout(time);
        setSearchResult(null);
      };
      return () => f();
      //hello i am john
    }
  }, [searchQuery]);
  const { globalState, dispatch } = useContext(Context);
  if (loading) return <Loading />;
  console.log(globalState.classData);
  return (
    <div className="messages__panel loading">
      <Suspense fallback={<Loading />}>
        <Modal
          open={modalMode}
          onClose={(e) => toggleModal(null)}
          classNames={{ wrapper: "center", content: "form__modal" }}
        >
          {modalMode === "join" ? <JoinClass /> : null}
        </Modal>
      </Suspense>
      <div className="join-or-create">
        <Button variant="outlined" onClick={(e) => toggleModal("join")}>
          <EmojiPeopleIcon />
        </Button>
        <Button variant="outlined" onClick={(e) => toggleModal("create")}>
          <AddIcon />
        </Button>
      </div>
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
      {loading ? (
        <Loading />
      ) : searchQuery.length > 0 ? (
        !searchResult ? (
          <Loading />
        ) : searchResult.length > 0 ? (
          <>
            <h4 style={{ textAlign: "center" }}>Search result</h4>
            <div className="messages__list">
              {searchResult.map((r) => (
                <MessItem
                  path={r.classId}
                  key={r.classId}
                  name={r.name}
                  onClick={(e) => alert("open message")}
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
            ? globalState.classData
                .filter((classs) => classs.owner == globalState.userData.id)
                .map((filteredClass) => (
                  <MessItem
                    path={filteredClass.classId}
                    key={filteredClass.classId}
                    name={filteredClass.name}
                    onClick={(e) => alert("open message")}
                    message="hello wuoc"
                    active={false}
                  ></MessItem>
                ))
            : globalState.classData.map((filteredClass) => (
                <MessItem
                  path={filteredClass.classId}
                  key={filteredClass.classId}
                  name={filteredClass.name}
                  onClick={(e) => alert("open message")}
                  message="hello wuoc"
                  active={false}
                ></MessItem>
              ))}
        </div>
      )}
    </div>
  );
};

export default MessagePanel;