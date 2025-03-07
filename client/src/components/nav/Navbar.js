import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "./navbar.css";
import { Context } from "../../context/Context";

const NavBar = () => {
  const { user, dispatch } = useContext(Context);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  return (
    <>
      <Navbar
        expand="lg"
        className="nav-menu mx-auto  mt-2 shadow p-1 mb-5 bg-body rounded-4"
      >
        <Container>
          <Navbar.Brand href="/">
            <img src="./logo192.png" alt="" />
            <span className="colored">MindMentor</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto menu">
              <Link className="nav-item" to="/">
                Home
              </Link>
              <Link className="nav-item" to="/about">
                About
              </Link>
              <Link className="nav-item" to="/resources">
                Resources
              </Link>
              <Link className="nav-item" to="/contact">
                Contact
              </Link>
              {user ? (
                <Link className="link" to="/chat">
                  Chat
                </Link>
              ) : (
                <Link></Link>
              )}
            </Nav>
            <Nav className="gap-4">
              {user ? (
                <div className="d-flex gap-4">
                  <button className="btn btn-primary" onClick={handleLogout}>
                    Logout
                  </button>
                  <Link className="link" to="/profile">
                    {profilePicture ? (
                      <img
                        src={
                          `http://localhost:4001/uploads/profile-pictures/` +
                          profilePicture
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
                  </Link>
                </div>
              ) : (
                <Link className="btn btn-primary" to="/login">
                  Login
                </Link>
              )}
              {!user && (
                <Link
                  className="btn btn-light text-black btn-sign"
                  to="/register"
                >
                  Sign up
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={cancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelLogout}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;
