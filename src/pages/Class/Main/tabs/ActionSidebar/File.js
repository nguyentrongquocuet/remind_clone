import React, { useState } from "react";
import AttachFilePreview from "../../../../../shared/Elements/AttachFilePreview";
import Button from "../../../../../shared/Elements/Button";
import ModalSubject from "../../../../../shared/Util/ModalSubject";
import Modal from "../../../../../shared/Elements/Modal";
import PreviewFile from "../../../Modal/PreviewFile";
import "./File.scss";

const File = ({ files }) => {
  const [onPreview, setOnPreview] = useState(null);
  return (
    <>
      <div className="class-files">
        {Object.values(files).map((file) => {
          return (
            <div key={file.id} className="class-file">
              <AttachFilePreview
                download
                visible
                onClick={(e) => {
                  ModalSubject.next({
                    type: "PREVIEW_IMAGE",
                    data: {
                      path: file.file || "/logo.png",
                    },
                  });
                }}
                fileUrl={file.file}
                supportVideo={false}
                showName={false}
              />
              <p className="class-file__filename">
                {file.file.match(/(?:[^/]+$)/gi)[0]}
              </p>
              <span className="class-file__day">
                {new Date(Date.parse(file.createAt)).toLocaleString()}
              </span>
              <Button
                className="class-file__preview"
                onClick={(e) => setOnPreview(file)}
              >
                View
              </Button>
            </div>
          );
        })}
      </div>
      {onPreview && (
        <Modal
          open={Boolean(onPreview)}
          onClose={(e) => setOnPreview(null)}
          classNames={{
            wrapper: "center",
            content: "form_modal",
          }}
        >
          <PreviewFile file={onPreview} />
        </Modal>
      )}
    </>
  );
};

export default File;
