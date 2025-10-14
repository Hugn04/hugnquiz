import { toast } from 'react-toastify';

const copyTextToClipboard = (text) => {
    if (!navigator.clipboard) {
        toast.error('Trình duyệt không hỗ trợ sao chép clipboard');
        return;
    }

    navigator.clipboard
        .writeText(text)
        .then(() => {
            toast.success('Sao chép thành công', { autoClose: 2000 });
        })
        .catch((err) => {
            console.error('Copy thất bại: ', err);
            toast.error('Sao chép thất bại');
        });
};

export default copyTextToClipboard;
