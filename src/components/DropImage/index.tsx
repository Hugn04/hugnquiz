import classNames from 'classnames/bind';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import Button from '../Button';
import style from './DropImage.module.scss';
import request from '../../utils/request';

const cx = classNames.bind(style);

interface DropImageProps {
    url?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface DropImageRef {
    uploadImage: () => Promise<{ url: string }>;
}

const DropImage = forwardRef<DropImageRef, DropImageProps>(({ url, className, style = {} }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | undefined>(url);
    const [text, setText] = useState<string>('Kéo và thả để tải ảnh lên');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            const result = fileReader.result as string;
            setImage(result);
            setFile(file);
        };
    };

    const getIdFromUrl = (url: string) => {
        const parts = url.split('/');
        const id = parts[parts.length - 1].split('.')[0];
        return id;
    };

    useImperativeHandle(ref, () => ({
        async uploadImage() {
            const formData = new FormData();

            if (image !== url) {
                if (url) {
                    formData.append('id', getIdFromUrl(url));
                }
                if (image && file) {
                    formData.append('image', file);
                }

                const { data } = await request.post('/upload_image', formData);
                return data as { url: string };
            }

            return { url: url ?? '' };
        },
    }));

    return (
        <div
            className={cx('wrapper', className)}
            style={style}
            onDragOver={(e) => {
                e.preventDefault();
                setText('Thả để tải ảnh');
            }}
            onDragLeave={() => {
                setText('Kéo và thả để tải ảnh lên');
            }}
            onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                    handleImageUpload(droppedFile);
                } else {
                    alert('Định dạng file không đúng');
                }
            }}
        >
            {image ? (
                <>
                    <button
                        className={cx('btn-close')}
                        onClick={() => {
                            setImage(undefined);
                            setText('Kéo và thả để tải ảnh lên');
                        }}
                    >
                        X
                    </button>
                    <img className={cx('img')} src={image} alt="Ảnh được tải lên" />
                </>
            ) : (
                <>
                    <div>{text}</div>
                    <span>hoặc</span>
                    <Button
                        onClick={() => {
                            inputRef.current?.click();
                        }}
                        variant="primary"
                    >
                        Chọn File
                    </Button>
                    <input
                        ref={inputRef}
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={(e) => {
                            const selectedFile = e.target.files?.[0];
                            if (selectedFile) handleImageUpload(selectedFile);
                        }}
                    />
                </>
            )}
        </div>
    );
});

export default DropImage;
