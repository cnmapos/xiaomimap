import React, { useState } from "react";
import Styles from "./styles.module.less";
import { Button, Input, message } from "antd";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("四川省景热门景点");

  const handleBack = () => {
    navigate("/");
  };

  const handleTitleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleSaveDraft = () => {
    message.success("保存草稿成功");
  };

  const handleReview = () => {
    message.info("正在审阅中...");
  };

  const handleExport = () => {
    message.success("导出成功");
  };

  return (
    <div className={Styles.header}>
      <div className={Styles.left}>
        <div className={Styles.back} onClick={handleBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className={Styles.title}>
          {isEditing ? (
            <Input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              autoFocus
            />
          ) : (
            <>
              <span>{title}</span>
              <div className={Styles.editTitle} onClick={handleTitleEdit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
      <div className={Styles.right}>
        <Button className={Styles.button} onClick={handleSaveDraft}>保存草稿</Button>
        <Button className={Styles.button} onClick={handleReview}>审阅</Button>
        <Button type="primary" className={Styles.button} onClick={handleExport}>导出</Button>
      </div>
    </div>
  );
};

export default Header;