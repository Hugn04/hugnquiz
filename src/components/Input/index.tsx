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

type ValidationFunction = (value: any, message?: string) => any;

interface ValidateRules {
    [key: string]: any;
}

interface SelectDataItem {
    title: string;
    value?: string | number;
}

export interface InputRef {
    getValue: () => string;
    validate: (isClick?: boolean) => boolean;
}

interface InputProps extends React.HTMLAttributes<HTMLInputElement | HTMLSelectElement> {
    style?: CSSProperties;
    validates?: ValidateRules;
    debouncedTime?: number;
    title?: string;
    toast?: boolean;
    type?: 'text' | 'number' | 'email' | 'select' | 'radio';
    data?: SelectDataItem[];
    defaultValue?: string;
    handleDebounce?: (value: string) => void;
    children?: React.ReactNode;
}

const Input = forwardRef<InputRef, InputProps>(
    (
        {
            style,
            validates,
            debouncedTime = 1000,
            title,
            toast,
            type = 'text',
            data = [],
            defaultValue,
            handleDebounce,
            children,
            ...props
        },
        ref,
    ) => {
        let Component: string = 'input';
        const { showToast } = useGlobalContext();

        const [inputValue, setInputValue] = useState<string>(() => {
            if (defaultValue) return defaultValue;
            if (type === 'select') return data[0]?.value?.toString() || data[0]?.title || '';
            return '';
        });

        const inputRef = useRef<HTMLInputElement>(null);
        const [error, setError] = useState<string>('');
        const classes = cx('input-group', { red: error });
        const debounceValue = useDebounce(inputValue, debouncedTime);
        const isFirstRender = useRef(true);

        const Validation: { [key: string]: ValidationFunction } = {
            require: (message) => (inputValue ? false : message),
            email: (message) => {
                const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                return regexEmail.test(inputValue) ? false : message;
            },
            min: (value: number, message?: string) => (inputValue.length >= value ? false : message),
            confirm: (value: any, message?: string) => {
                const valueConfirm = value.current.getValue();
                return valueConfirm === inputValue ? false : message;
            },
            maxNumber: (value: number, message?: string) => (Number(inputValue) <= value ? false : message),
            maxLength: (value: number, message?: string) => (inputValue.length <= value ? false : message),
            showMessage: (message: string) => message,
        };

        const validate = useCallback(
            (isClick?: boolean) => {
                if (validates) {
                    for (const key in validates) {
                        if (Object.hasOwnProperty.call(validates, key)) {
                            const message = validates[key];
                            if (Validation[key]) {
                                if (typeof message === 'object') {
                                    const messageError = Validation[key](message.value, message.message);
                                    if (messageError !== false) {
                                        setError(messageError);
                                        if (isClick) {
                                            showToast?.(messageError);
                                        }
                                        return false;
                                    }
                                } else {
                                    const messageError = Validation[key](message);
                                    if (messageError !== false) {
                                        setError(messageError);
                                        if (isClick) {
                                            showToast?.(messageError);
                                        }
                                        return false;
                                    }
                                }
                            } else {
                                console.error('Not validate', key);
                            }
                        }
                    }
                } else {
                    console.error('You dont props validate');
                }
                setError('');
                return true;
            },
            [inputValue, validates, showToast],
        );

        useImperativeHandle(ref, () => ({
            getValue: () => inputValue,
            validate,
        }));

        useEffect(() => {
            if (validates) {
                if (inputRef.current) {
                    inputRef.current.onblur = () => validate();
                }
            }
        }, [inputValue, validate, validates]);

        if (type === 'select') {
            Component = 'select';
            if (!data.length) data = [{ title: 'Không có dữ liệu' }];
        }

        useEffect(() => {
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
            if (handleDebounce) {
                handleDebounce(inputValue);
            }
            if (validates) validate();
        }, [debounceValue]);

        const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            setInputValue(e.target.value);
        };

        const _props: any = { type, ...props };

        return (
            <div className={cx('wraper')} style={style}>
                <div className={classes}>
                    {title && <label className={cx('label')}>{title}</label>}
                    <div className={cx('core')}>
                        <Component
                            ref={inputRef}
                            placeholder=" "
                            value={inputValue}
                            onChange={handleInputChange}
                            {..._props}
                        >
                            {type === 'select'
                                ? data.map((item, index) => (
                                      <option key={index} value={item?.value ?? item.title}>
                                          {item.title}
                                      </option>
                                  ))
                                : null}
                        </Component>
                    </div>
                </div>
                <div className={cx('err-mesage')}>{error && error}</div>
            </div>
        );
    },
);

export default Input;
