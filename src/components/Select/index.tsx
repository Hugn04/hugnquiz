import classNames from 'classnames/bind';
import {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    type CSSProperties,
    type JSX,
} from 'react';

import useDebounce from '../../hooks/useDebounce';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import styles from './Select.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

export interface SelectRef<T> {
    getValue: () => T | null;
    validate: (isClick?: boolean) => string | false;
}

interface ValidateRules {
    require?: string;
    email?: string;
    showMessage?: string;
}

interface SelectInnerProps<T> {
    canClose?: boolean;
    style?: CSSProperties;
    validates?: ValidateRules;
    debouncedTime?: number;
    placeholder: string;
    items: T[];
    filter?: (items: T[], searchQuery: string) => T[];
    render: (item: T) => string;
    onSelect?: (item: T | null) => void;
    defaultValue?: T;
    title?: string;
}

function SelectInner<T>(
    {
        items,
        filter,
        render,
        validates,
        defaultValue,
        title,
        debouncedTime = 0,
        onSelect,
        placeholder,
        canClose,
    }: SelectInnerProps<T>,
    ref: React.Ref<SelectRef<T>>,
) {
    const { showToast } = useGlobalContext();
    const inputRef = useRef<HTMLInputElement>(null);

    const [searchQuery, setSearchQuery] = useState(() => {
        return defaultValue ? render(defaultValue) : '';
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selected, setSelected] = useState<T | null>(defaultValue ?? null);
    const [error, setError] = useState('');
    const debounceValue = useDebounce(searchQuery, debouncedTime);

    const filteredItems = filter ? filter(items, debounceValue) : items;

    // const valueStr = selected ? render(selected) : '';

    const validate = useCallback(
        (isClick = false): string | false => {
            if (!validates) return false;

            if (validates.require && !selected) {
                setError(validates.require);
                if (isClick) showToast(validates.require);
                return validates.require;
            }
            setError('');
            return false;
        },
        [selected, validates, showToast],
    );

    useImperativeHandle(ref, () => ({
        getValue() {
            return selected;
        },
        validate,
    }));

    useEffect(() => {
        if (onSelect) onSelect(selected);
    }, [selected]);
    if (!filter) {
        return (
            <select
                onChange={(e) => {
                    const select = JSON.parse(e.target.value) as T;
                    setSelected(select);
                }}
                className={cx('select-input')}
            >
                {filteredItems.map((item, index) => {
                    return (
                        <option key={index} value={JSON.stringify(item)} className={cx('select-item')}>
                            {render(item)}
                        </option>
                    );
                })}
            </select>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('select-wrapper')}>
                {title && <label className={cx('label')}>{title}</label>}
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={() => setIsDropdownOpen(true)}
                    onFocus={() => {
                        setSearchQuery('');
                        setIsDropdownOpen(true);
                    }}
                    onBlur={() => {
                        validate();
                        if (selected) {
                            setSearchQuery(render(selected));
                        } else {
                            setSearchQuery('');
                        }

                        // if (!searchQuery) {
                        // }
                        setTimeout(() => setIsDropdownOpen(false), 150);
                    }}
                    placeholder={placeholder}
                    className={cx('select-input')}
                />
                {canClose && selected && (
                    <div
                        onClick={() => {
                            setSelected(null);
                            setSearchQuery('');
                        }}
                        className={cx('close')}
                    >
                        <FontAwesomeIcon size="sm" icon={faClose}></FontAwesomeIcon>
                    </div>
                )}

                {isDropdownOpen && (
                    <div className={cx('select-dropdown')}>
                        {filteredItems?.map((item, index) => {
                            const classes = cx('select-item', {
                                selected: selected === item,
                            });
                            return (
                                <div
                                    key={index}
                                    className={classes}
                                    onMouseDown={() => {
                                        setSelected(item);
                                        setSearchQuery(render(item));

                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {render(item)}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {validates && <div className={cx('err-mesage')}>{error}</div>}
        </div>
    );
}
const Select = forwardRef(SelectInner) as <T>(
    props: SelectInnerProps<T> & { ref?: React.Ref<SelectRef<T>> },
) => JSX.Element;

export default Select;
