import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from "@mui/icons-material/Home";
import SidebarChat from "./SidebarChat";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ contacts, changeChat }) => {
  const navigate = useNavigate();
  //Getting Profile picture from MongoDB
  const [profilePicture, setProfilePicture] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("mindmentor-user");

    if (currentUser) {
      try {
        // Parse the currentUser string as JSON
        const currentUserObjects = JSON.parse(currentUser);

        // Accessing the profilePicture property
        const getPicture = currentUserObjects.profilePicture;

        // Seting the profilePicture in the component's state
        setProfilePicture(getPicture);
      } catch (e) {
        // Handle any parsing errors if the data is not valid JSON
        console.e("Error parsing this data:", e);
      }
    }
  }, []);

  const handleClick = (e) => {
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar_header">
        {profilePicture ? (
          <img
            src={
              `http://localhost:4001/uploads/profile-pictures/` + profilePicture
            }
            alt="User Profile-Picture"
            className="topImg"
            width="150"
          />
        ) : (
          <img
            src="./Unisex-avatar.jpg"
            alt="Default Profile-Picture"
            className="topImg"
            width="150"
          />
        )}
        <div className="sidebar_headerRight">
          <IconButton onClick={(e) => handleClick(e)}>
            <HomeIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input placeholder="Search or start new chat" type="text" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        <SidebarChat contacts={contacts} changeChat={changeChat} />
      </div>
    </div>
  );
};

export default Sidebar;
