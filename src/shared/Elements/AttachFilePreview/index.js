import React, { useEffect, useLayoutEffect, useState } from "react";
import isImage from "../../Util/ImageDetect";
import useLazy from "../../Util/lazy-hook";
import "./AttachFilePreview.scss";
const fileImages = {
  image: "/imgplaceholder.png",
  archive: "/archive.png",
  code: "/code.png",
  markup: "/markup.png",
  video: "/video.png",
  audio: "/audio.png",
  doc: "/msword.png",
  powerpoint: "/mspowerpoint.png",
  excel: "/msexcel.png",
  plaintext: "/plaintext.png",
  unknown: "/unknown.png",
};
const getFileType = (url) => {
  const ext = url.match(/(?:[^.]+$)/gi)[0].toLowerCase();
  switch (ext) {
    case "img":
    case "svg":
    case "jpeg":
    case "jpg":
    case "gif":
    case "png":
      return "image";
    case "txt":
      return "plaintext";
    case "doc":
    case "docx":
      return "doc";
    case "html":
    case "htm":
      return "markup";
    case "ppt":
    case "pptx":
      return "powerpoint";
    case "js":
    case "ts":
    case "java":
    case "css":
    case "scss":
    case "php":
    case "cpp":
    case "py":
      return "code";
    case "mp3":
    case "wma":
    case "acc":
    case "wav":
    case "flag":
      return "audio";
    case "mp4":
    case "mkv":
    case "mov":
    case "wmv":
    case "flv":
    case "avi":
    case "avchd":
    case "webm":
      return "video";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
    case "bz2":
    case "zipx":
    case "apk":
      return "archive";
    case "exe":
      return "program";
    default:
      return "unknown";
  }
};
const AttachFilePreview = ({
  onClick,
  className,
  fileUrl,
  visible,
  download,
  file,
  supportVideo = true,
  ...props
}) => {
  const [preview, setPreview] = useState({
    type: "unknown",
    url: fileUrl,
    name: "Unknown",
  });
  useEffect(() => {
    if (file) {
      const { name } = file;
      if (isImage(file)) {
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", () => {
          setPreview({
            url: fileReader.result,
            name: name,
            type: "image",
          });
          return;
        });
        fileReader.readAsDataURL(file);
      } else {
        setPreview({
          url: fileImages[getFileType(file.name)],
          name: file.name,
          type: getFileType(file.name),
        });
        return;
      }
    } else {
      if (fileUrl) {
        const type = getFileType(fileUrl);
        if (type === "image") {
          setPreview({
            url: fileUrl,
            name: fileUrl.match(/(?:[^/]+$)/gi)[0],
            type: "image",
          });
          return;
        } else {
          setPreview({
            url: fileUrl,
            type: type,
            name: fileUrl.match(/(?:[^/]+$)/gi)[0],
          });
        }
        return;
      }
    }
  }, [fileUrl, file]);

  if (preview.type === "image")
    return (
      <>
        <div
          style={{
            backgroundImage: visible
              ? `url("${
                  preview.url || "/imgplaceholder.png"
                }"),url("/imgplaceholder.png")`
              : "",
          }}
          id={visible ? "" : "image__wrapper"}
          onClick={(e) =>
            onClick && onClick(e, { name: preview.name, path: preview.url })
          }
          className={className || "file-preview image"}
          title={preview.name || "hello"}
        >
          <img
            className="image-placeholder"
            src={visible ? preview.url : ""}
            alt="hello"
          />
        </div>
      </>
    );
  if (supportVideo && preview.type === "video") {
    return (
      <div className="file-preview video">
        <video controls className="file-type-preview-video">
          <source src={preview.url} type="video/mp4"></source>
        </video>
      </div>
    );
  }
  return (
    <div className="file-preview">
      <a
        className="file-type-preview"
        title={preview.name}
        href={(!file && preview.url) || "#"}
        download={download}
      >
        <img
          className="file-type-preview-image"
          src={preview.url && fileImages[preview.type]}
        />
        {preview.url && (
          <img className="file-type-preview-image" src="/download.png" />
        )}
      </a>
      <span className="file-name">{preview.name}</span>
    </div>
  );
};

export default AttachFilePreview;
