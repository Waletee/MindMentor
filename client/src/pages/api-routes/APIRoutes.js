export const host = "http://localhost:4001";
export const registerRoute = `${host}/api/auth/register`;
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const getAllUsersRoute = `${host}/api/auth/allusers`;
export const accountSettingsRoute = `${host}/api/auth/accountsettings/`;
export const accountDeleteRoute = `${host}/api/auth/accountdelete/`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const getUserRoute = `${host}/api/auth/user`;
export const createChatRoute = `${host}/chat`;
export const userChatRoute = `${host}/chat/userchat`;
export const findChathatRoute = `${host}/chat/find/:firstId/:secondId`;
export const addMessageRoute = `${host}/api/messages/addmsg`;
export const getMessageRoute = `${host}/api/messages/getmsg`;
