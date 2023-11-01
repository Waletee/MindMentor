import React, { useState, useEffect } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";

function SidebarChat({ addNewChat, contacts, changeChat }) {
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  {
    /*const createChat = () => {
    const userName = prompt("Please enter a user to chat with");

    if (userName) {
      //input database stuffs here
    }
  };*/
  }

  return !addNewChat ? (
    <div className="contacts">
      {contacts.map((contact, index) => {
        return (
          <div
            key={index}
            className={`contact ${index === currentSelected ? "selected" : ""}`}
            onClick={() => changeCurrentChat(index, contact)}
          >
            {contact.profilePicture ? (
              <img
                src={contact.profilePicture}
                alt=""
                className="rounded-circle"
                width="50"
              />
            ) : (
              <img
                src="./Unisex-avatar.jpg"
                alt=""
                className="rounded-circle"
                width="50"
              />
            )}
            <div className="username">
              <h2>{contact.username}</h2>
              <p>{contact.profession}</p>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div /*onClick={createChat}*/ className="sidebarChat">
      <h2>Chats</h2>
    </div>
  );
}

export default SidebarChat;
