import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card } from "@material-ui/core";
import Loading from "../../../shared/components/Loading";
import MessItem from "../../../shared/components/Sidebar/MesItem";
import TextField from "../../../shared/Elements/TextField";
import ClassService from "../../../services/ClassService";
import "./JoinClass.scss";
import { Context } from "../../../shared/Util/context";
import { useHistory } from "react-router-dom";

const JoinClass = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { globalState, dispatch } = useContext(Context);
  const history = useHistory();
  const joinClass = useCallback((classId) => {
    ClassService.joinClass(classId)
      .then((data) => {
        dispatch({
          type: "ADD_CLASS",
          payload: data.data,
        });
        history.push(`/classes/${classId}`);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    if (searchQuery.length > 0) {
      // setSearching(true);
      const time = setTimeout(async () => {
        try {
          const data = await ClassService.findClass(searchQuery, true);
          console.log("join", data.data);
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
  return (
    <Card className="joinclass">
      <header className="joinclass__header">Join Class</header>
      <main className="joinclass__main">
        <p>Enter @class-code or class-name</p>
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
        {searchQuery.length > 0 ? (
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
                    onClick={(e) => {
                      e.preventDefault();
                      joinClass(r.classId);
                    }}
                    active={false}
                  ></MessItem>
                ))}
              </div>
            </>
          ) : (
            <h4 style={{ textAlign: "center" }}>No result</h4>
          )
        ) : null}
      </main>
    </Card>
  );
};

export default JoinClass;
