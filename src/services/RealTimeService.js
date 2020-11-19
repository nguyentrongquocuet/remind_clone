import io from "socket.io-client";
import { Subject, Observable } from "rxjs";
class RealtimeService {
  init({ dispatch, globalState }) {
    this.io = io.connect("http://localhost:5000");
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
    this.io.emit("auth", globalState.userData.id);

    this.IOSubject = new Observable((observer) => {
      this.io.on("messages", (data) => {
        observer.next(data);
      });
    });
  }
}

export default new RealtimeService();
