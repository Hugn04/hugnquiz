import classNames from 'classnames/bind';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState, type CSSProperties, type JSX } from 'react';

import useDebounce from '../../hooks/useDebounce';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import styles from './Select.module.scss';
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
    style?: CSSProperties;
    validates?: ValidateRules;
    debouncedTime?: number;
    placeholder: string;
    items: T[];
    filter?: (items: T[], searchQuery: string) => T[];
    render: (item: T) => string;
    onSelect?: (item: T) => void;
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
                        if (!searchQuery && selected) {
                            setSearchQuery(render(selected));
                        }
                        setTimeout(() => setIsDropdownOpen(false), 150);
                    }}
                    placeholder={placeholder}
                    className={cx('select-input')}
                />

                {isDropdownOpen && (
                    <div className={cx('select-dropdown')}>
                        {filteredItems?.map((item, index) => (
                            <div
                                key={index}
                                className={cx('select-item')}
                                onMouseDown={() => {
                                    setSelected(item);
                                    setSearchQuery(render(item));
                                    if (onSelect) onSelect(item);
                                    setIsDropdownOpen(false);
                                }}
                            >
                                {render(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={cx('err-mesage')}>{error}</div>
        </div>
    );
}
const Select = forwardRef(SelectInner) as <T>(
    props: SelectInnerProps<T> & { ref?: React.Ref<SelectRef<T>> },
) => JSX.Element;

export default Select;
