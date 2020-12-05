import { Card } from "@material-ui/core";
import React, { useCallback, useContext, useState } from "react";
import MessageService from "../../../services/MessageService";
import AttachFilePreview from "../../../shared/Elements/AttachFilePreview";
import Button from "../../../shared/Elements/Button";
import { Context } from "../../../shared/Util/context";
import ModalSubject from "../../../shared/Util/ModalSubject";
import PopupSubject from "../../../shared/Util/PopupSubject";
import "./SchedulePreview.scss";
// [roomId]:"type"
const classesFromRoomIds = (classData, roomIds) => {
  const out = {};
  for (const classD of Object.values(classData)) {
    if (roomIds[classD.roomId]) {
      out[classD.classId] = roomIds[classD.roomId];
    }
  }
  return out;
};

const SchedulePreview = ({ schedules, onClose }) => {
  const { globalState } = useContext(Context);
  const onEdit = useCallback(async (schedule) => {
    try {
      const scheduleDetailsRawData = await MessageService.getScheduleDetails(
        schedule.scheduleId
      );
      const scheduleDetails = scheduleDetailsRawData.data;
      const a = classesFromRoomIds(
        globalState.classData,
        Object.keys(scheduleDetails.roomIds)
      );
      ModalSubject.next({
        type: "CREATE_ANNOUNCEMENT",
        data: {
          mode: "edit",
          initialValues: {
            classes: classesFromRoomIds(
              globalState.classData,
              scheduleDetails.roomIds
            ),
            content: scheduleDetails.content,
            scheduleTime: scheduleDetails.time,
            file: scheduleDetails.file,
            scheduleId: scheduleDetails.scheduleId,
          },
        },
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          PopupSubject.next({
            type: "WARN",
            message: error.response.data || "Some errors occured",
            showTime: 5,
          });
        } else {
          PopupSubject.next({
            type: "WARN",
            message: "Cannot edit this schedule!",
            showTime: 5,
          });
        }
      }
    }
  }, []);
  const onDelete = useCallback(async (schedule) => {
    try {
      await MessageService.deleteSchedule(schedule.scheduleId);
      PopupSubject.next({
        type: "SUCCESS",
        message: "The schedule has been canceled",
        showTime: 5,
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          PopupSubject.next({
            type: "WARN",
            message: error.response.data || "Some errors occured",
            showTime: 5,
          });
        } else {
          PopupSubject.next({
            type: "WARN",
            message: "Cannot edit this schedule!",
            showTime: 5,
          });
        }
      }
    }
  }, []);
  return (
    <Card className="schedules-preview">
      <header className="schedules-preview__header">
        <h2>Preview Your Schedules</h2>
      </header>
      <div className="schedules-preview__schedules">
        {schedules.map((schedule) => {
          return (
            <div key={schedule.scheduleId} className="schedule-overview">
              <div
                className="schedule__content"
                dangerouslySetInnerHTML={{
                  __html: schedule.content,
                }}
              ></div>
              {schedule.file && (
                <div className="schedule__file">
                  <AttachFilePreview
                    className="schedule__file--attach"
                    download
                    fileUrl={schedule.file}
                    visible={true}
                    supportVideo={true}
                    onClick={(e) =>
                      ModalSubject.next({
                        type: "PREVIEW_IMAGE",
                        data: {
                          path: schedule.file,
                        },
                      })
                    }
                  />
                </div>
              )}
              <p className="schedule-overview__time">
                {new Date(schedule.time).toLocaleString()}
              </p>
              <div className="schedule-overview__actions">
                <Button
                  onClick={(e) => {
                    onEdit(schedule);
                  }}
                  variant="outlined"
                >
                  Edit
                </Button>
                <Button
                  onClick={(e) => {
                    PopupSubject.next({
                      type: "CONFIRM",
                      message:
                        "Are you sure you want to delete this announcement?",
                      onConfirm: (e) => onDelete(schedule),
                      onCancel: null,
                    });
                    // onDelete(schedule);
                  }}
                  color="secondary"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default SchedulePreview;
