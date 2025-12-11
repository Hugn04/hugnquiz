const getUserByEmail = (email: string) => {
    return email.split('@')[0];
};
export default getUserByEmail;
