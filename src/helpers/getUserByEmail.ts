const getUserByEmail = (email) => {
    return email.split('@')[0];
};
export default getUserByEmail;
