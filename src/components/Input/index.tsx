import classNames from 'classnames/bind';
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    type ChangeEvent,
    type CSSProperties,
} from 'react';

import useDebounce from '../../hooks/useDebounce';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import styles from './Input.module.scss';
const cx = classNames.bind(styles);
export interface InputRef {
    getValue: () => string;
    validate: (isClick?: boolean) => string | false;
}

interface ValidateRules {
    require?: string;
    email?: string;
    min?: { value: number; message: string };
    confirm?: { value: { current: InputRef }; message: string };
    maxNumber?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    showMessage?: string;
}
type ValidationResult = string | false;
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    style?: CSSProperties;
    validates?: ValidateRules;
    debouncedTime?: number;
    title?: string;
    toast?: boolean;
    defaultValue?: string;
    handleDebounce?: (value: string) => void;
    children?: React.ReactNode;
}
const Input = forwardRef<InputRef, InputProps>(
    ({ style, validates, debouncedTime = 1000, title, defaultValue = '', handleDebounce, ...props }, ref) => {
        const { showToast } = useGlobalContext();
        const [inputValue, setInputValue] = useState<string>(defaultValue);
        const inputRef = useRef<HTMLInputElement>(null);
        const [error, setError] = useState('');
        const classes = cx('input-group', { red: error });
        const debounceValue = useDebounce(inputValue, debouncedTime);
        const isFirstRender = useRef(true);
        useEffect(() => {
            if (handleDebounce) handleDebounce(defaultValue);
        }, []);
        const validate = useCallback(
            //isClick is Button component click
            (isClick = false): string | false => {
                if (validates) {
                    for (const key of Object.keys(validates) as (keyof ValidateRules)[]) {
                        const rule = validates[key];

                        if (rule === undefined) continue;

                        let result: ValidationResult = false;

                        switch (key) {
                            case 'require':
                                result = Validation.require(rule as string);
                                break;

                            case 'showMessage':
                                result = Validation.showMessage(rule as string);
                                break;

                            case 'email':
                                result = Validation.email(rule as string);
                                break;

                            case 'min': {
                                const { value, message } = rule as { value: number; message: string };
                                result = Validation.min(value, message);
                                break;
                            }

                            case 'confirm': {
                                const { value, message } = rule as { value: { current: InputRef }; message: string };
                                result = Validation.confirm(value, message);
                                break;
                            }

                            case 'maxNumber': {
                                const { value, message } = rule as { value: number; message: string };
                                result = Validation.maxNumber(value, message);
                                break;
                            }

                            case 'maxLength': {
                                const { value, message } = rule as { value: number; message: string };
                                result = Validation.maxLength(value, message);
                                break;
                            }
                        }

                        if (result) {
                            setError(result);
                            if (isClick) {
                                showToast(result);
                            }
                            return result; // ⛔ gặp lỗi thì thoát luôn
                        }
                    }
                }
                setError('');
                return false; // ✅ không lỗi
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [inputValue],
        );
        useImperativeHandle(ref, () => ({
            getValue() {
                return inputValue;
            },
            validate,
        }));
        const Validation = {
            require: (message: string) => (inputValue ? false : message),
            email: (message: string) => {
                const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                return regexEmail.test(inputValue.toString()) ? false : message;
            },
            min: (value: number, message: string) => (inputValue.toString().length >= value ? false : message),
            confirm: (value: { current: InputRef }, message: string) => {
                const valueConfirm = value?.current?.getValue();
                return valueConfirm === inputValue ? false : message;
            },
            maxNumber: (value: number, message: string) => {
                const valueNumber = Number.parseInt(inputValue as string);
                if (Number.isNaN(valueNumber)) {
                    return 'Đây không phải số';
                }
                return valueNumber <= value ? false : message;
            },
            maxLength: (value: number, message: string) => (inputValue.toString().length <= value ? false : message),
            showMessage: (message: string) => message,
        };

        useEffect(() => {
            if (validates) {
                if (inputRef.current) {
                    inputRef.current.onblur = () => {
                        validate();
                    };
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [inputValue]);

        useEffect(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            if (handleDebounce) handleDebounce(debounceValue);
            if (validates && debounceValue !== '') {
                validate();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [debounceValue]);
        const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        };

        return (
            <div className={cx('wraper')} style={style}>
                <div className={classes}>
                    {title && <label className={cx('label')}>{title}</label>}
                    <div className={cx('core')}>
                        <input
                            ref={inputRef}
                            placeholder=" "
                            value={inputValue}
                            onChange={handleInputChange}
                            {...props}
                        />
                        {/* <button className={cx('btn')}>
                        <FontAwesomeIcon icon={fa42Group}></FontAwesomeIcon>
                    </button> */}
                    </div>
                </div>
                {validates && <div className={cx('err-mesage')}>{error && error}</div>}
            </div>
        );
    },
);

export default Input;
