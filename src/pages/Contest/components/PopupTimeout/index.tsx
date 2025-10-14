import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';

import styles from './PopupTimeout.module.scss';
import getObjStyleClassName from '../../../../helpers/getObjStyleClassName';
import { forwardRef, memo, useImperativeHandle, useState } from 'react';
const cx = classNames.bind(styles);

const contentStyle = getObjStyleClassName(cx('content-popup'));
const overlayStyle = getObjStyleClassName(cx('overlay'));
const arrowStyle = getObjStyleClassName(cx()); // style for an svg element
function PopupTimeout({ onClose = () => {} }, ref) {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        onOpen() {
            setOpen((o) => !o);
        },
    }));
    return (
        <Popup
            open={open}
            closeOnDocumentClick
            modal
            onClose={() => {
                setOpen(false);
                onClose();
            }}
            {...{ contentStyle, overlayStyle, arrowStyle }}
        >
            <div className={cx('wrapper')}>
                <h1>Bạn đã hết thời gian làm bài thi</h1>
            </div>
        </Popup>
    );
}

export default memo(forwardRef(PopupTimeout));
