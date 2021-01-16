import React, { useEffect, useState, useContext, Suspense } from "react";
import ClassService from "../../../services/ClassService";
import { useHistory, useParams } from "react-router-dom";
import { Context } from "../../Util/context";
import Button from "../../Elements/Button";
import HeaderNav from "../../Elements/HeaderNav";
import TextField from "../../Elements/TextField";
import Loading from "../Loading";
import MessItem from "../Sidebar/MesItem";
import Modal from "../../Elements/Modal";
import AddIcon from "@material-ui/icons/Add";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import FaceIcon from "@material-ui/icons/Face";
import CreateClass from "../../../pages/Class/Modal/CreateClass";
import PopupSubject from "../../Util/PopupSubject";
import ModalSubject from "../../Util/ModalSubject";
import ConnectChild from "../../../pages/Class/Modal/ConnectChild";
import ROLE from "../../Util/ROLE";
import MessageService from "../../../services/MessageService";
import "./MessagePanel.scss";
const JoinClass = React.lazy(() =>
  import("../../../pages/Class/Modal/JoinClass")
);

const toggleChildrenClass = (e) => {
  document.getElementById("children-class-checkbox").click();
};
const MessagePanel = ({ loading }) => {
  const { globalState, dispatch } = useContext(Context);
  const [panelMode, setPanelMode] = useState("classes");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [modalMode, setModal] = useState(null);
  const [childClasses, setChildClasses] = useState(null);
  const [privateData, setPrivateData] = useState(null);
  const [conSearch, setConSearch] = useState("");
  const role = ROLE[globalState.userData.role];
  console.log("CHECK_ROLE", role);
  const history = useHistory();
  const { userData } = globalState;
  const { classId } = useParams();
  const getChildrenClasses = async (e) => {
    const classes = await ClassService.getChildClasses();
    setChildClasses(classes.data);
    console.log(classes.data);
  };
  const toggleModal = (mode) => {
    if (mode) setModal(mode);
    else setModal(null);
  };
  const joinClass = (classD) => {
    ClassService.joinClass(classD.classId)
      .then((data) => {
        dispatch({
          type: "ADD_CLASS",
          payload: data.data,
        });
        PopupSubject.next({
          type: "SUCCESS",
          message: `You've joined ${classD.name}`,
          showTime: 5,
        });
        history.push(`/classes/${classD.classId}`);
      })
      .catch((error) => {
        PopupSubject.next({
          type: "WARN",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        });
      });
  };

  useEffect(() => {
    if (panelMode === "private") {
      const getPrivateChatData = async () => {
        //fetch private chat room of this class
        const privateData = await MessageService.getPrivateChatData(classId);
        setPrivateData(privateData.data);
      };
      getPrivateChatData();
    }
  }, [panelMode]);
  useEffect(() => {
    ModalSubject.subscribe((data) => {
      switch (data.type) {
        case "CREATE_CLASS":
          toggleModal("create");
          break;
        case "JOIN_CLASS":
          toggleModal("join");
        case "CONNECT_CHILD":
          toggleModal("connect-child");
      }
    });
    if (role === "Parent") getChildrenClasses();
  }, [role]);

  useEffect(() => {
    if (!loading && searchQuery.length > 0) {
      const time = setTimeout(async () => {
        try {
          const data = await ClassService.findClass(searchQuery);
          setSearchResult(data.data);
        } catch (error) {
          error.response &&
            PopupSubject.next({
              type: "WARN",
              message: error.response
                ? error.response.data
                : "Some errors occured",
              showTime: 5,
            });
        }
        setConSearch(searchQuery);
      }, 1000);
      const f = () => {
        clearTimeout(time);
        setSearchResult(null);
      };
      return () => f();
    } else {
      setConSearch("");
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
          {modalMode === "connect-child" && <ConnectChild />}
        </Modal>
      </Suspense>
      <div className="sticky">
        <div className="join-or-create">
          {role !== "Teacher" && (
            <>
              <span>Join Some Classes:</span>
              <Button variant="outlined" onClick={(e) => toggleModal("join")}>
                <EmojiPeopleIcon />
              </Button>
            </>
          )}
          {role === "Parent" && (
            <>
              <span>Connect to your children:</span>
              <Button
                variant="outlined"
                onClick={(e) => toggleModal("connect-child")}
              >
                <FaceIcon />
              </Button>
            </>
          )}
          {role === "Teacher" && (
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
              elements={
                classId
                  ? [
                      {
                        onClick: (e) => setPanelMode("classes"),
                        text: "CLASSES",
                        active: panelMode === "classes",
                      },
                      {
                        onClick: (e) => setPanelMode("private"),
                        text: "CONVERSATIONS",
                        active: panelMode === "private",
                      },
                    ]
                  : [
                      {
                        onClick: (e) => setPanelMode("classes"),
                        text: "CLASSES",
                        active: panelMode === "classes",
                      },
                    ]
              }
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
      ) : searchQuery.length > 0 && panelMode === "classes" ? (
        !searchResult ? (
          <Loading className="user-search-loading" />
        ) : searchResult.length > 0 ? (
          <>
            <h4 style={{ textAlign: "center" }}>Search result</h4>
            <div className="messages__list">
              {searchResult.map((r) => (
                <MessItem
                  owner={r.owner === userData.id}
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
      ) : panelMode === "classes" ? (
        <>
          {role === "Parent" && (
            <>
              <h3 onClick={toggleChildrenClass}>Your childen's classes</h3>
              <input
                style={{ display: "none" }}
                type="checkbox"
                id="children-class-checkbox"
              />
              <div className="messages__list">
                {childClasses ? (
                  Object.values(childClasses).map((filteredClass) => (
                    <MessItem
                      onClick={(e) => joinClass(filteredClass)}
                      avatar={filteredClass.avatar}
                      path={filteredClass.classId}
                      key={filteredClass.classId}
                      name={filteredClass.name}
                      unread={filteredClass.unread}
                      active={false}
                    ></MessItem>
                  ))
                ) : (
                  <Loading />
                )}
              </div>
            </>
          )}

          <div className="messages__list">
            <h3>Your classes</h3>
            {Object.values(globalState.classData)
              // .filter((classs) => classs.owner == globalState.userData.id)
              .map((filteredClass) => (
                <MessItem
                  owner={filteredClass.owner === userData.id}
                  avatar={filteredClass.avatar}
                  path={filteredClass.classId}
                  key={filteredClass.classId}
                  name={filteredClass.name}
                  unread={filteredClass.unread}
                  active={false}
                ></MessItem>
              ))}
          </div>
        </>
      ) : privateData ? (
        <div className="messages-list">
          {privateData
            .filter((p) => {
              const reg = new RegExp(conSearch, "i");
              return reg.test(`${p.firstName} ${p.lastName}`);
            })
            .map((p) => {
              return (
                <MessItem
                  avatar={p.avatar}
                  path={`${classId}/private/${p.id}`}
                  key={p.id}
                  name={`${p.firstName} ${p.lastName}`}
                  // unread={p.unread}
                  active={false}
                ></MessItem>
              );
            })}
        </div>
      ) : (
        // <p>{JSON.stringify(privateData)}</p>
        <Loading />
      )}
    </div>
  );
};

export default MessagePanel;
