import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';

const LoginWithGoogle = ({ setLoginFalse }: { setLoginFalse: (value: React.SetStateAction<boolean>) => void }) => {
    const { login } = useAuth();
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        const id_token = credentialResponse.credential;
        if (!id_token) {
            console.error('Không lấy được id_token từ Google');
            return;
        }
        setLoginFalse(true);
        login(id_token);
        setLoginFalse(false);
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.log('Đăng nhập thất bại');
            }}
        />
    );
};

export default LoginWithGoogle;
