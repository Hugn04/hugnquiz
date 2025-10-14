import classNames from 'classnames/bind';
import styles from './Time.module.scss';
import {
    useState,
    useEffect,
    memo,
    forwardRef,
    useImperativeHandle,
    useCallback,
    type ReactNode,
    type ForwardedRef,
} from 'react';

const cx = classNames.bind(styles);

type TimeProps = {
    notAlwayRunning?: boolean;
    finishFn?: () => void;
    className?: string;
    time?: number;
    countDown?: boolean;
    children?: ReactNode;
};

export type TimeRef = {
    restart: () => void;
    stop: () => void;
    start: (times: number) => void;
    getTime: () => string;
};

type ClockType = { hours: number; minutes: number; seconds: number };

function Time(
    { notAlwayRunning = false, finishFn = () => {}, className = '', time = 0, countDown = false, children }: TimeProps,
    ref: ForwardedRef<TimeRef>,
) {
    const [seconds, setSeconds] = useState<number>(time);
    const [clock, setClock] = useState<ClockType>({ hours: 0, minutes: 0, seconds: 0 });
    const classes = cx('wraper', className);
    const [idInterval, setIdInterval] = useState<ReturnType<typeof setInterval> | null>(null);

    const handleStart = useCallback(() => {
        if (idInterval) clearInterval(idInterval);

        const interval = setInterval(() => {
            setSeconds((prevTime) => prevTime + (countDown ? -1 : 1));
        }, 1000);
        setIdInterval(interval);
    }, [countDown, idInterval]);

    useEffect(() => {
        if (!notAlwayRunning) handleStart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        return () => {
            if (idInterval) clearInterval(idInterval);
        };
    }, [idInterval]);

    const getTimeBySec = useCallback((seconds: number): ClockType => {
        return {
            hours: Math.floor(seconds / 3600),
            minutes: Math.floor((seconds % 3600) / 60),
            seconds: seconds % 60,
        };
    }, []);

    useEffect(() => {
        setClock(getTimeBySec(seconds));
        if (seconds <= 0 && countDown) {
            if (idInterval) clearInterval(idInterval);
            finishFn();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seconds]);

    useImperativeHandle(
        ref,
        (): TimeRef => ({
            restart() {
                setSeconds(time);
                handleStart();
            },
            stop() {
                if (idInterval) clearInterval(idInterval);
            },
            start(times: number) {
                setSeconds(times);
                handleStart();
            },
            getTime() {
                let currentTime;
                if (countDown) {
                    currentTime = getTimeBySec(time - seconds);
                } else {
                    currentTime = getTimeBySec(seconds);
                }
                return `${currentTime.hours}:${currentTime.minutes}:${currentTime.seconds}`;
            },
        }),
    );

    return (
        <div className={classes}>
            {children}
            <time>
                {clock.hours} : {clock.minutes} : {clock.seconds}
            </time>
        </div>
    );
}

export default memo(forwardRef<TimeRef, TimeProps>(Time));
