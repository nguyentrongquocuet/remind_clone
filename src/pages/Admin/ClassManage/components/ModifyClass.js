import React, { useEffect, useState } from "react";
import AdminService from "services/AdminService";
import Loading from "shared/components/Loading";
import PickupAvatar from "shared/components/PickupAvatar";
import Button from "shared/Elements/Button";
import Card from "shared/Elements/Card";
import TextField from "shared/Elements/TextField";
import "./ModifyClass.scss";

const ModifyClass = ({ classId, onUndo = () => {}, onSuccess = () => {} }) => {
  const [classData, setClassData] = useState({});
  const [newData, setNewData] = useState({
    img: null,
    name: null,
  });
  useEffect(() => {
    if (classId) {
      getClassData();
    }
  }, [classId]);

  const getClassData = async () => {
    const { data } = await AdminService.getClassInfo(classId);
    setClassData(data);
  };

  const updateClass = (e) => {
    e.preventDefault();
    const name = e.currentTarget.elements.name.value.trim();
    const formData = new FormData();
    formData.append("classId", classId);
    formData.append("name", name || classData.name);
    newData.img && formData.append("avatar", newData.img, newData.img.name);
    AdminService.modifyClass(formData).then((data) => {
      onSuccess();
    });
  };

  const onPickImage = (image) => {
    setNewData((prev) => {
      return { ...prev, img: image };
    });
  };
  console.log("classData", classData);
  return classData ? (
    <Card className="modify-class">
      <form onSubmit={updateClass}>
        <PickupAvatar
          onChange={onPickImage}
          defaultSrc={newData.img || classData.avatar}
        />
        <TextField
          name="name"
          placeholder={classData.name}
          defaultValue={classData.name}
        />
        <br />
        <div className="flex f-row self-f-v-c">
          <Button size="small" type="submit">
            Save
          </Button>
          <Button onClick={onUndo} className="cancel" size="small">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  ) : (
    <Loading />
  );
};

export default ModifyClass;
