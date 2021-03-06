import { Subject, Observable } from "rxjs";
import io from "socket.io-client";
class RealtimeService {
  init({ dispatch, globalState }) {
    this.io = io.connect("http://localhost:5000");
    console.log("check socket");
    this.io.on("auth", () => {
      dispatch({
        1: {
          type: "SET_TOKEN",
          payload: globalState.token,
        },
        2: {
          type: "SET_USER_DATA",
          payload: globalState.userData,
        },
        3: {
          type: "LOGIN_SUCCESS",
        },
        4: { type: "SET_IO", payload: this.io },
        5: { type: "SET_UP_DONE" },
      });
    });
    this.io.on("disconnect", (reason) => {
      console.log("io has disconnected, Error: ", reason);
    });
    this.io.on("connect", () => {
      console.log("connected");
      this.io.emit("auth", globalState.userData.id);
    });
    this.io.on("reconnect", (attemptNumber) => {
      console.log("reconn", attemptNumber);
    });
    this.IOSubject = new Observable((observer) => {
      this.io.on("messages", (data) => {
        console.log("messagess", data);
        observer.next({ type: "MESSAGES", payload: data });
      });
      this.io.on("schedule", (data) => {
        observer.next({
          type: "SCHEDULE",
          action: "START",
          payload: {
            ...data.schedule,
          },
        });
        // switch (data.type) {
        //   case "SCHEDULE_START":

        // }
        console.log(data);
      });
    });
  }
}

export default new RealtimeService();
