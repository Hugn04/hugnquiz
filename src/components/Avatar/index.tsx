import classNames from 'classnames/bind';
import 'tippy.js/dist/tippy.css';
import styles from './Avatar.module.scss';
import images from '../../assets/images';

const cx = classNames.bind(styles);

type AvatarProps = {
    url: string;
    size?: number;
    frameUrl?: string;
    classNames?: string;
};

function Avatar({ url, size = 36, frameUrl = '', classNames }: AvatarProps) {
    return (
        <div className={cx('wrapper', classNames)} style={{ width: size, height: size }}>
            {frameUrl && <img className={cx('frame')} src={frameUrl} alt="Khung"></img>}
            <img
                className={cx('avatar', {
                    avatarframe: frameUrl,
                })}
                src={url || images.defaultAvatar}
                alt="Avatar"
            ></img>
        </div>
    );
}

export default Avatar;
