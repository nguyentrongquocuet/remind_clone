const detect = (file) => {
  const readFile = new FileReader();
  return new Promise((resolve, reject) => {
    if (file instanceof File || file instanceof Blob) {
      readFile.addEventListener("loadend", () => {
        const data = readFile.result;
        const headerArray = new Uint8Array(data).subarray(0, 4);
        let head = "";
        for (let i = 0; i < headerArray.length; i++) {
          head += headerArray[i].toString(16);
        }
        resolve(head);
      });
      readFile.readAsArrayBuffer(file);
    } else {
      reject("File Error");
    }
  });
};

export default detect;
