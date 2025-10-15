import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';

import styles from './MyExample.module.scss';
import CardExample from '../../components/CardExample';
import request from '../../utils/request';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import type { Example, Links, Pagegination } from '../../types/exam';
const cx = classNames.bind(styles);
type Page = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    groupPage: Links[];
};
function MyExample() {
    const [page, setPage] = useState<Page>({
        prevPageUrl: null,
        nextPageUrl: null,
        groupPage: [],
    });
    const [listMyExample, setListMyExample] = useState<Example[]>([]);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const getExample = useCallback(
        (url = 'get-myexample') => {
            setIsLoading(true);
            request
                .get(url, { params: { query: search } })
                .then((example) => {
                    handleChangePage(example.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                    toast('Không thể kết nối tới server');
                });
        },
        [search],
    );
    const handleChangePage = (example: Pagegination) => {
        const { prev_page_url, next_page_url, links } = example;
        links.shift();
        links.pop();
        window.scrollTo(0, 0);
        setPage({ prevPageUrl: prev_page_url, nextPageUrl: next_page_url, groupPage: links });
        setListMyExample(example.data);
    };
    useEffect(() => {
        getExample();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
    return (
        <div className={cx('wraper')}>
            <div className={cx('filter')}>
                <Input
                    title="Tìm kiếm"
                    handleDebounce={(value) => {
                        setSearch(value);
                    }}
                ></Input>
                {isLoading && <Loading></Loading>}
                <div className={cx('tag')}></div>
            </div>
            <div className={cx('content')}>
                {listMyExample.map((example, index) => {
                    return <CardExample getExample={getExample} key={index} example={example} myExample></CardExample>;
                })}
                <div className={cx('page')}>
                    <Button
                        variant="primary"
                        disable={!page.prevPageUrl}
                        onClick={() => {
                            getExample(page.prevPageUrl ?? '');
                        }}
                    >
                        Trang trước
                    </Button>
                    <div className={cx('group-page')}>
                        {page.groupPage?.map((page, index) => {
                            return (
                                <Button
                                    disable={page.active || page.label === '...'}
                                    variant="primary"
                                    key={index}
                                    onClick={() => {
                                        getExample(page.url ?? '');
                                    }}
                                >
                                    {page.label}
                                </Button>
                            );
                        })}
                    </div>
                    <Button
                        variant="primary"
                        disable={!page.nextPageUrl}
                        onClick={() => {
                            getExample(page.nextPageUrl ?? '');
                        }}
                    >
                        Trang tiếp
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default MyExample;
