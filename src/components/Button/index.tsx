import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { forwardRef, memo, useEffect, type ReactNode } from 'react';

import styles from './Button.module.scss';
import type { InputRef } from '../Input';
import type { OTPInputRef } from '../OTPInput';
const cx = classNames.bind(styles);

export interface ValidateInputRef {
    current: InputRef | OTPInputRef | null;
}
export interface BaseButtonProps {
    children?: ReactNode;
    className?: string;
    icon?: IconProp;
    leftIcon?: IconProp;
    rightIcon?: IconProp;
    iconColor?: string;
    to?: string;
    href?: string;
    disable?: boolean;
    userselect?: boolean;
    variant?: 'primary' | 'outline' | 'white' | 'danger' | 'link';
    size?: 'small' | 'large';
    validateInput?: ValidateInputRef[];
    onClick?: () => void;
}

type ButtonAsLink = BaseButtonProps & {
    to: string;
    href?: never;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

// --- Kiểu cho thẻ a (liên kết ngoài)
type ButtonAsAnchor = BaseButtonProps & {
    href: string;
    to?: never;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;
type ButtonAsButton = BaseButtonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        to?: never;
        href?: never;
    };
type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor;
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>((props, ref) => {
    const {
        validateInput,
        leftIcon,
        rightIcon,
        className,
        onClick = () => {},
        to,
        href,
        icon,
        iconColor,
        disable,
        userselect,
        variant,
        size,
        children,
        ...rest
    } = props;

    const classes = cx(
        'wraper',
        className,
        variant ? { [variant]: true } : undefined,
        size ? { [size]: true } : undefined,
        {
            disable,
            userselect,
            'icon-single': icon,
        },
    );

    let fnClick = onClick;

    const handleValidateInput = (inputs: ValidateInputRef[]) => {
        const tempEvent = onClick;
        fnClick = () => {
            const error = inputs.map((input) => input?.current?.validate(true));
            if (error.every((element) => typeof element !== 'string')) {
                if (tempEvent) tempEvent();
            }
        };
    };
    useEffect(() => {
        if (validateInput) {
            handleValidateInput(validateInput);
        }
    }, [validateInput]);
    if ('to' in props && to) {
        return (
            <Link
                ref={ref as React.Ref<HTMLAnchorElement>}
                to={props.to}
                onClick={() => {
                    fnClick();
                }}
                className={classes}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(rest as any)}
            >
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
            </Link>
        );
    }
    if ('href' in props && href) {
        return (
            <a
                ref={ref as React.Ref<HTMLAnchorElement>}
                href={props.href}
                onClick={() => {
                    fnClick();
                }}
                className={classes}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...(rest as any)}
            >
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
            </a>
        );
    }
    return (
        <button
            ref={ref as React.Ref<HTMLButtonElement>}
            onClick={() => {
                fnClick();
            }}
            className={classes}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(rest as any)}
        >
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
        </button>
    );

    // <Component ref={ref} className={classes} disabled={!!disable} {..._props} {...rest}>
    // {icon ? (
    //     <FontAwesomeIcon icon={icon} color={iconColor} />
    // ) : (
    //     <>
    //         {leftIcon && (
    //             <div className={cx('icon')}>
    //                 <FontAwesomeIcon icon={leftIcon} />
    //             </div>
    //         )}
    //         <span className={cx('title')}>{children}</span>
    //         {rightIcon && (
    //             <div className={cx('icon')}>
    //                 <FontAwesomeIcon icon={rightIcon} />
    //             </div>
    //         )}
    //     </>
    // )}
    // </Component>
});

export default memo(Button);
