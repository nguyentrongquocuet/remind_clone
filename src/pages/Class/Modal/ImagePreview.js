import React, { Suspense } from "react";
import Loading from "../../../shared/components/Loading";
import "./ImagePreview.scss";
const Modal = React.lazy(() => import("../../../shared/Elements/Modal"));
const ImagePreview = ({ open, onClose, previewObject }) => {
  return (
    <Suspense fallback={<Loading />}>
      <Modal
        closeButton={false}
        open={Boolean(previewObject)}
        classNames={{ wrapper: "center", content: "imagePreview" }}
        onClose={onClose}
        header={
          <div className="preview__header">
            <span>
              {previewObject.name ||
                previewObject.path.match(/([^/]+$)/gi)[0] ||
                "image"}
            </span>
            <span style={{ flex: "1 1 auto" }}></span>
            <a
              className="preview__action"
              target="_blank"
              href={previewObject.path}
            >
              View
            </a>
            <a
              className="preview__action"
              target="_blank"
              href={previewObject.path}
            >
              Download
            </a>
            <a className="preview__action" onClick={onClose}>
              Exit{" "}
            </a>
          </div>
        }
      >
        <div className="preview" style={{ pointerEvents: "none" }}>
          <img src={previewObject.path} alt="hello" className="full-preview" />
        </div>
      </Modal>
    </Suspense>
  );
};

export default ImagePreview;
