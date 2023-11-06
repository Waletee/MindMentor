import React, { useEffect, useState } from "react";
import "./profiles.css";

const UserProfile = () => {
  //Current User details
  const [fullName, setfullName] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [following, setFollowing] = useState("");
  const [followers, setFollowers] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("mindmentor-user");

    if (currentUser) {
      try {
        // Parse the currentUser string as JSON
        const currentUserObjects = JSON.parse(currentUser);

        // Accessing the MonogoDB property
        const getFullname = currentUserObjects.fullname;
        const getProfession = currentUserObjects.profession;
        const getLocation = currentUserObjects.state_country;
        const getPicture = currentUserObjects.profilePicture;
        const getFollowing = currentUserObjects.following;
        const getFollowers = currentUserObjects.followers;

        // Seting the collected properties in the component's state
        setfullName(getFullname);
        setProfession(getProfession);
        setLocation(getLocation);
        setProfilePicture(getPicture);
        setFollowing(getFollowing);
        setFollowers(getFollowers);
      } catch (e) {
        // Handle any parsing errors if the data is not valid JSON
        console.e("Error parsing this data:", e);
      }
    }
  }, []);

  return (
    <div className="col-md-4 mb-3">
      <div className="card">
        <div className="card-body user-body">
          <div className="d-flex flex-column align-items-center text-center">
            {profilePicture ? (
              <img
                src={
                  `http://localhost:4001/uploads/profile-pictures/` +
                  profilePicture
                }
                alt="User Profile-Picture"
                className="rounded-circle"
                width="150"
              />
            ) : (
              <img
                src="./Unisex-avatar.jpg"
                alt="Default Profile-Picture"
                className="rounded-circle"
                width="150"
              />
            )}
            <div className="mt-3">
              <h4>{fullName}</h4>
              <p className="text-secondary mb-1">{profession}</p>
              <p className="text-muted font-size-sm">{location}</p>
            </div>
          </div>
          <div className="followstatus">
            <hr />
            <div>
              <div className="follow">
                <span>{following.length}</span>
                <span>Following</span>
              </div>
              <div className="follow">
                <span>{followers.length}</span>
                <span>Follower</span>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
