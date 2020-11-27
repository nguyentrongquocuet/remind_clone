import React, { useState, useEffect, useContext, useCallback } from "react";
import { Card } from "@material-ui/core";
import Loading from "../../../shared/components/Loading";
import MessItem from "../../../shared/components/Sidebar/MesItem";
import TextField from "../../../shared/Elements/TextField";
import ClassService from "../../../services/ClassService";
import "./JoinClass.scss";
import { Context } from "../../../shared/Util/context";
import { useHistory } from "react-router-dom";
import popupSubject from "../../../shared/Util/PopupSubject";
import PopupSubject from "../../../shared/Util/PopupSubject";

const JoinClass = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { globalState, dispatch } = useContext(Context);
  const history = useHistory();
  const joinClass = useCallback((classD) => {
    ClassService.joinClass(classD.classId)
      .then((data) => {
        dispatch({
          type: "ADD_CLASS",
          payload: data.data,
        });
        onClose();
        PopupSubject.next({
          type: "SUCCESS",
          message: `You've joined ${classD.name}`,
          showTime: 5,
        });
        history.push(`/classes/${classD.classId}`);
      })
      .catch((error) => {
        popupSubject.next({
          type: "ERROR",
          message: error.response ? error.response.data : "Some errors occured",
          showTime: 5,
        });
      });
  }, []);
  useEffect(() => {
    if (searchQuery.length > 0) {
      // setSearching(true);
      const time = setTimeout(async () => {
        try {
          const data = await ClassService.findClass(searchQuery, true);
          setSearchResult(data.data);
          // setSearching(false);
        } catch (error) {
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
                      joinClass(r);
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
