exports.getAllClassId = (classData, roomIds) => {
  const out = [];
  for (const classD of Object.values(classData)) {
    if (roomIds.includes(classD.roomId.toString())) out.push(classD.classId);
  }
  return out;
};
exports.getOneClassId = (classData, roomId) => {
  if (!roomId) return roomId;
  for (const classD of Object.values(classData)) {
    if (roomId == classD.roomId) return classD.roomId;
  }
  return null;
};
