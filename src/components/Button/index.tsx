import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, memo, type ReactNode, type MouseEventHandler } from 'react';

import styles from './Button.module.scss';
const cx = classNames.bind(styles);

// Type cho các input ref trong validateInput
export interface ValidateInputRef {
    current: {
        validate: (showError?: boolean) => boolean;
    };
}

export interface ButtonProps {
    children?: ReactNode;
    className?: string;
    primary?: boolean;
    outline?: boolean;
    icon?: any; // FontAwesomeIconProp
    leftIcon?: any;
    rightIcon?: any;
    white?: boolean;
    danger?: boolean;
    small?: boolean;
    large?: boolean;
    iconColor?: string;
    to?: string;
    href?: string;
    disable?: boolean;
    userselect?: boolean;
    validateInput?: ValidateInputRef[];
    onClick?: MouseEventHandler<HTMLElement>;
    [key: string]: any; // các props khác
}

const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
    const {
        validateInput,
        leftIcon,
        rightIcon,
        className,
        primary,
        outline,
        icon,
        white,
        danger,
        small,
        large,
        iconColor,
        to,
        onClick = () => {},
        href,
        disable,
        userselect,
        children,
        ...rest
    } = props;

    const classes = cx('wraper', className, {
        primary,
        outline,
        'icon-single': icon,
        white,
        danger,
        small,
        large,
        disable,
        userselect,
    });

    let Component: any = 'button';
    let _props: any = { onClick };

    if (disable) {
        _props = {};
    }

    if (to) {
        Component = Link;
        _props.to = to;
    } else if (href) {
        Component = 'a';
        _props.href = href;
    }

    const handleValidateInput = (inputs: ValidateInputRef[]) => {
        const tempEvent = _props.onClick;
        _props.onClick = () => {
            const error = inputs.map((input) => input.current.validate(true));
            if (error.every((element) => element)) {
                tempEvent();
            }
        };
    };

    if (validateInput) {
        handleValidateInput(validateInput);
    }

    return (
        <Component ref={ref} className={classes} disabled={!!disable} {..._props} {...rest}>
            {icon ? (
                <FontAwesomeIcon icon={icon} color={iconColor} />
            ) : (
                <>
                    {leftIcon && (
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={leftIcon} />
                        </div>
                    )}
                    <span className={cx('title')}>{children}</span>
                    {rightIcon && (
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={rightIcon} />
                        </div>
                    )}
                </>
            )}
        </Component>
    );
});

export default memo(Button);
