import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import {
  accountSettingsRoute,
  accountDeleteRoute,
  getAllUsersRoute,
  followUser,
  unFollowUser,
} from "../../pages/api-routes/APIRoutes";

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //error notification
  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  //Current User details
  const [userName, setUsername] = useState("");
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");
  const [profession, setProfession] = useState("");
  const [location, setLocation] = useState("");
  const [userId, setUserId] = useState("");
  const [following, setFollowing] = useState("");

  useEffect(() => {
    const currentUser = localStorage.getItem("mindmentor-user");

    if (currentUser) {
      try {
        // Parse the currentUser string as JSON
        const currentUserObjects = JSON.parse(currentUser);

        // Accessing the username property
        const getUsername = currentUserObjects.username;
        const getFullname = currentUserObjects.fullname;
        const getEmail = currentUserObjects.email;
        const getProfession = currentUserObjects.profession;
        const getLocation = currentUserObjects.state_country;
        const getId = currentUserObjects._id;
        const getFollowing = currentUserObjects.following;

        // Setting the username in the component's state
        setUsername(getUsername);
        setfullName(getFullname);
        setEmail(getEmail);
        setProfession(getProfession);
        setLocation(getLocation);
        setUserId(getId);
        setFollowing(getFollowing);
      } catch (e) {
        // Handle any parsing errors if the data is not valid JSON
        console.e("Error parsing this data:", e);
      }
    }
  }, []);

  const [editMode, setEditMode] = useState(false);

  // Initialize state variables for updated user data
  const [updatedFullName, setUpdatedFullName] = useState("");
  const [updatedUsername, setUpdatedUsername] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedProfession, setUpdatedProfession] = useState("");
  const [updatedLocation, setUpdatedLocation] = useState("");
  const [picture, setPicture] = useState(null);
  const [updatedPassword, setUpdatedPassword] = useState("");

  const handleToggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation) {
      const updatedUserData = {
        fullname: updatedFullName,
        username: updatedUsername,
        email: updatedEmail,
        profession: updatedProfession,
        state_country: updatedLocation,
        password: updatedPassword,
        profilePicture: picture,
      };

      const config = {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure you set the correct content type
        },
      };

      // Send a PUT request to update user information
      const { data } = await axios.put(
        accountSettingsRoute + userId,
        updatedUserData,
        config
      );
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        // Update the local user data and exit edit mode
        localStorage.setItem("mindmentor-user", JSON.stringify(data.user));
        setEditMode(false);

        // Refresh the page
        window.location.reload();
      }
    }
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setPicture(img);
    }
  };

  //Delete Profile Function

  const handleDelete = async () => {
    // Show a confirmation dialog to confirm the delete action
    const confirmation = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );

    if (confirmation) {
      try {
        // Send a DELETE request to delete the user's profile
        const { data } = await axios.delete(accountDeleteRoute + userId);

        if (data.status === false) {
          toast.error(data.msg, toastOptions);
        } else if (data.status === true) {
          // Delete was successful, log the user out and redirect to the login page
          localStorage.removeItem("mindmentor-user");
          navigate("/register");
        }
      } catch (error) {
        console.error("Error deleting user profile:", error);
        toast.error(
          "An error occurred while deleting your profile. Please try again later.",
          toastOptions
        );
      }
    }
  };

  //handle validation
  const handleValidation = () => {
    const { password, username, email, fullname, profession, state_country } =
      this.state;
    if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    } else if (profession === "") {
      toast.error("What you do is required.", toastOptions);
      return false;
    } else if (state_country === "") {
      toast.error("Your present state and country is required.", toastOptions);
      return false;
    } else if (fullname.length < 6) {
      toast.error(
        "Fullname should be greater than 6 characters.",
        toastOptions
      );
      return false;
    }

    return true;
  };

  // State variable to store user preferences
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState("");

  // Function to add a new preference
  const handleAddPreference = () => {
    if (newPreference.trim() !== "") {
      setPreferences([...preferences, newPreference]);
      setNewPreference("");
    }
  };

  // Function to remove a preference
  const handleRemovePreference = (preference) => {
    const updatedPreferences = preferences.filter(
      (item) => item !== preference
    );
    setPreferences(updatedPreferences);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getAllUsersRoute}/${userId}`);
        setContacts(response.data);
        setLoading(false); // Set loading to false on successful response
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error); // Set error state in case of an error
        setLoading(false); // Set loading to false on error
      }
    };

    fetchData();
  }, [userId]);

  //handle follow and unfollow functinalities
  const handleFollow = async (followerId) => {
    try {
      // Send a PUT request to follow the user
      const followData = await axios.put(followUser + `/${followerId}`, {
        _id: userId,
      });

      if (followData.status === 200) {
        // Handle the response as needed, e.g., update UI
        console.log("User followed!");
      } else {
        // Handle other response statuses or errors
        console.error("Failed to follow user.");
        // Handle the response as needed

        // Update the contacts array to replace _id with followerId
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === followerId
              ? { ...contact, _id: followerId }
              : contact
          )
        );
      }
    } catch (error) {
      // Handle any errors that may occur during the follow process
      console.error("Error following user:", error);
    }
  };

  // Helper function to unfollow a user
  const handleUnFollow = async (followerId) => {
    try {
      const unfollowData = await axios.put(unFollowUser + `/${followerId}`, {
        _id: userId,
      });
      // Handle the response as needed

      if (unfollowData.status === 200) {
        // Handle the response as needed, e.g., update UI
        console.log("User unfollowed!");
      } else {
        // Handle other response statuses or errors
        console.error("Failed to unfollow user.");
        // Handle the response as needed

        // Update the contacts array to replace _id with followerId
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === followerId
              ? { ...contact, _id: followerId }
              : contact
          )
        );
      }
    } catch (error) {
      // Handle any errors that may occur during the unfollow process
      console.error("Error unfollowing user:", error);
    }
  };

  console.log("Numbers of followers:", following.length);

  return (
    <>
      <div className="col-md-8">
        <div className="card mb-3">
          <div className="card-body">
            <form encType="multipart/form-data">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={fullName}
                      name="fullname"
                      value={updatedFullName}
                      onChange={(e) => setUpdatedFullName(e.target.value)}
                    />
                  ) : (
                    fullName
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Username</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={userName}
                      name="username"
                      value={updatedUsername}
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                    />
                  ) : (
                    userName
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={email}
                      name="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                    />
                  ) : (
                    email
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Profession</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={profession}
                      name="profession"
                      value={updatedProfession}
                      onChange={(e) => setUpdatedProfession(e.target.value)}
                    />
                  ) : (
                    profession
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">State/Country</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      type="text"
                      className="form-control"
                      placeholder={location}
                      name="location"
                      value={updatedLocation}
                      onChange={(e) => setUpdatedLocation(e.target.value)}
                    />
                  ) : (
                    location
                  )}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Profile Image</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {editMode ? (
                    <input
                      key="fileInput"
                      className="form-control"
                      type="file"
                      name="profilePicture"
                      onChange={onImageChange}
                    />
                  ) : null}
                </div>
              </div>
              <hr />
              {editMode ? (
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0"> New Password</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {editMode ? (
                      <input
                        type="text"
                        className="form-control"
                        placeholder="********"
                        name="password"
                        value={updatedPassword}
                        onChange={(e) => setUpdatedPassword(e.target.value)}
                      />
                    ) : (
                      "*********"
                    )}
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div className="col-sm-3">
                    <h6 className="mb-0">Password</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">********</div>
                </div>
              )}
              <hr />
              <div className="row">
                <div className="col-sm-12">
                  {editMode ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleToggleEdit}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="fl-btn"
                      onClick={handleToggleEdit}
                    >
                      Edit Profile
                    </button>
                  )}
                  {editMode ? (
                    <button className="fl-btn ms-2" onClick={handleSubmit}>
                      Update
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger ms-2 "
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Followers */}
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h1>People You May Know</h1>
          </div>
          <div className=" card-body follower-view">
            {contacts.map((follower, id) => {
              const isFollowing = following.includes(follower._id);

              return (
                <div className="follower">
                  <div>
                    {follower.profilePicture ? (
                      <img
                        src={
                          `http://localhost:4001/uploads/profile-pictures/` +
                          follower.profilePicture
                        }
                        alt=""
                        className="followerImg"
                      />
                    ) : (
                      <img
                        src="./Unisex-avatar.jpg"
                        alt=""
                        className="followerImg"
                      />
                    )}

                    <div className="follower-name">
                      <span>{follower.fullname}</span>
                      <span>{follower.username}</span>
                    </div>
                  </div>
                  <button
                    className="fl-btn"
                    onClick={() => {
                      if (isFollowing) {
                        handleUnFollow(follower._id);
                      } else {
                        handleFollow(follower._id);
                      }
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* User Preferences */}
      <div className="container my-5">
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h1>User Preferences</h1>
          </div>
          <div className="card-body">
            <Form>
              <Form.Group>
                <Form.Label>Add a Support Preference:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="stress, anxiety, depression..."
                  value={newPreference}
                  onChange={(e) => setNewPreference(e.target.value)}
                />
              </Form.Group>
              <Button
                className="mt-2"
                variant="primary"
                onClick={handleAddPreference}
              >
                Add Preference
              </Button>
            </Form>
            <div className="mt-3">
              <h4>Your Saved Preferences:</h4>
              <div className="btn-group gap-1">
                {preferences.map((preference, index) => (
                  <Button
                    key={index}
                    variant="btn-outline-secondary"
                    className="btn-sm btn-block"
                    onClick={() => handleRemovePreference(preference)}
                  >
                    {preference} <span className="text-danger">X</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        <h1>Recommended</h1>
        <div className="row mt-4">
          <div className="col-lg-3 col-sm-6 mb-4">
            <div className="card profile" style={{ width: "18rem" }}>
              <img src="./mentor1.jpg" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Pitch Dark</h5>
                <p className="mb-2 pb-1 user-prof">Senior Journalist</p>
                <div className="d-flex justify-content-between rounded-3 p-2 mb-2 inner-content">
                  <div>
                    <p className="small text-muted mb-1">Category</p>
                    <p className="mb-0">Mentor</p>
                  </div>
                  <div className="px-3">
                    <p className="small text-muted mb-1">Status</p>
                    <p className="mb-0">Available</p>
                  </div>
                </div>
                <Link className="btn btn-primary profile-btn">Book Now</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <div className="card profile" style={{ width: "18rem" }}>
              <img src="./mentor1.jpg" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Pitch Dark</h5>
                <p className="mb-2 pb-1 user-prof">Senior Journalist</p>
                <div className="d-flex justify-content-between rounded-3 p-2 mb-2 inner-content">
                  <div>
                    <p className="small text-muted mb-1">Category</p>
                    <p className="mb-0">Mentor</p>
                  </div>
                  <div className="px-3">
                    <p className="small text-muted mb-1">Status</p>
                    <p className="mb-0">Available</p>
                  </div>
                </div>
                <Link className="btn btn-primary profile-btn">Book Now</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <div className="card profile" style={{ width: "18rem" }}>
              <img src="./mentor1.jpg" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Pitch Dark</h5>
                <p className="mb-2 pb-1 user-prof">Senior Journalist</p>
                <div className="d-flex justify-content-between rounded-3 p-2 mb-2 inner-content">
                  <div>
                    <p className="small text-muted mb-1">Category</p>
                    <p className="mb-0">Mentor</p>
                  </div>
                  <div className="px-3">
                    <p className="small text-muted mb-1">Status</p>
                    <p className="mb-0">Available</p>
                  </div>
                </div>
                <Link className="btn btn-primary profile-btn">Book Now</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6 mb-4">
            <div className="card profile" style={{ width: "18rem" }}>
              <img src="./mentor1.jpg" className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Pitch Dark</h5>
                <p className="mb-2 pb-1 user-prof">Senior Journalist</p>
                <div className="d-flex justify-content-between rounded-3 p-2 mb-2 inner-content">
                  <div>
                    <p className="small text-muted mb-1">Category</p>
                    <p className="mb-0">Mentor</p>
                  </div>
                  <div className="px-3">
                    <p className="small text-muted mb-1">Status</p>
                    <p className="mb-0">Available</p>
                  </div>
                </div>
                <Link className="btn btn-primary profile-btn">Book Now</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
