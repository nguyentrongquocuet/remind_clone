import React, { useEffect, useState, useContext } from "react";
import ClassService from "../../../services/ClassService";
import HeaderNav from "../../Elements/HeaderNav";
import TextField from "../../Elements/TextField";
import { Context } from "../../Util/context";
import Loading from "../Loading";
import MessItem from "../Sidebar/MesItem";
import "./MessagePanel.scss";
const dummyClasses = [
  // {
  //   id: 1,
  //   name: "quoc1",
  // },
  // {
  //   id: 3,
  //   name: "quoc3",
  // },
  // {
  //   id: 4,
  //   name: "quoc4",
  // },
  // {
  //   id: 5,
  //   name: "quoc5",
  // },
];
const dummyClasses2 = [
  // {
  //   id: 1,
  //   name: "quoc1",
  // },
  // {
  //   id: 3,
  //   name: "quoc3",
  // },
  // {
  //   id: 4,
  //   name: "quoc4",
  // },
  // {
  //   id: 5,
  //   name: "quoc5",
  // },
  // {
  //   id: 6,
  //   name: "quoc6",
  // },
  // {
  //   id: 7,
  //   name: "quoc7",
  // },
  // {
  //   id: 8,
  //   name: "quoc8",
  // },
  // {
  //   id: 9,
  //   name: "quoc9",
  // },
  // {
  //   id: 10,
  //   name: "quoc10",
  // },
  // {
  //   id: 11,
  //   name: "quoc11",
  // },
];
const MessagePanel = ({ loading }) => {
  console.log("PANEL REINE");
  const [panelMode, setPanelMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
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
      <HeaderNav
        elements={[
          {
            onClick: (e) => setPanelMode((prev) => !prev),
            text: "JOINED",
            active: !panelMode,
          },
          {
            onClick: (e) => setPanelMode((prev) => !prev),
            text: "OWNED",
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
