import React, { forwardRef, useImperativeHandle, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import classNames from 'classnames/bind';
import styles from './OTPInput.module.scss';

const cx = classNames.bind(styles);

export interface OTPInputRef {
    getValue: () => string;
    validate: () => boolean;
}

interface OTPInputProps {
    length?: number; // cho phép tùy chỉnh độ dài OTP
}

const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(({ length = 6 }, ref) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
    const [error, setError] = useState<string>('');
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useImperativeHandle(ref, () => ({
        getValue() {
            return otp.join('');
        },
        validate() {
            if (otp.includes('')) {
                setError('Vui lòng nhập đầy đủ mã OTP.');
                return false;
            }
            setError('');
            return true;
        },
    }));

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // focus ô kế tiếp
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);

            setTimeout(() => {
                if (inputRefs.current[index - 1]) {
                    inputRefs.current[index - 1]?.focus();
                }
            }, 1);
        }
    };

    return (
        <>
            <div className={cx('otp-input')}>
                {otp.map((data, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        className={cx('otp-field')}
                        type="text"
                        name={`otp-${index}`}
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onFocus={(e) => e.target.select()}
                    />
                ))}
            </div>
            {error && <p className={cx('error')}>{error}</p>}
        </>
    );
});

export default OTPInput;
