import React, { useEffect, useState } from "react";
import "./Settings.scss";
import Button from "../../../../../shared/Elements/Button";
import ClassService from "services/ClassService";
import PickupAvatar from "shared/components/PickupAvatar";
import PopupSubject from "shared/Util/PopupSubject";
import TextField from "shared/Elements/TextField";
const Settings = ({ classId }) => {
  const [classData, setClassData] = useState({
    data: {
      avatar: null,
      classId: null,
      name: null,
    },
    permissions: {
      modify: false,
      leave: false,
    },
    ownerData: {
      name: null,
      avatar: null,
    },
  });
  const [newData, setNewData] = useState({
    img: null,
    name: null,
  });
  const updateClass = (e) => {
    e.preventDefault();
    const name = e.currentTarget.elements.name.value.trim();
    const formData = new FormData();
    formData.append("classId", classId);
    formData.append("name", name || classData.data.name);
    newData.img && formData.append("avatar", newData.img, newData.img.name);
    ClassService.modifyClass(formData);
  };
  const onLeaveClass = (e) => {
    e.preventDefault();
    PopupSubject.next({
      type: "CONFIRM",
      onConfirm: () => leaveClass(classId),
      message: "DO YOU WANT TO LEAVE THIS CLASS",
    });
  };
  const leaveClass = (classId) => {
    ClassService.leaveClass(classId);
  };
  const onPickImage = (image) => {
    setNewData((prev) => {
      return { ...prev, img: image };
    });
  };
  // const

  useEffect(() => {
    if (classId) getSettings(classId);
  }, [classId]);

  const getSettings = (classId) =>
    ClassService.getSettings(classId).then(({ data }) => setClassData(data));
  const { data, permissions, ownerData } = classData;
  console.log("CHECK_CLASS", classData);

  return (
    <div className="center flex f-column pad-50-rem settings">
      <form className="flex f-column f-v-c" onSubmit={updateClass}>
        <PickupAvatar
          required
          disabled={!permissions.modify}
          onChange={onPickImage}
          defaultSrc={newData.img || data.avatar}
        />
        <TextField
          name="name"
          placeholder={data.name}
          defaultValue={data.name}
          readonly={!permissions.modify}
        />
        <div className="flex f-row self-f-v-c mar-50-rem">
          <Button size="small" disabled={!permissions.modify} type="submit">
            Save
          </Button>
        </div>
      </form>
      {/* <PickupAvatar required disabled={!permissions.edit} onChange /> */}
      <Button
        disabled={!permissions.leave}
        className="leaveclass"
        variant="outlined"
        color="secondary"
        onClick={onLeaveClass}
      >
        Leave Class
      </Button>
    </div>
  );
};

export default Settings;
