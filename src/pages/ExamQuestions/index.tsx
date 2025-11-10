import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './ExamQuestions.module.scss';
import CardExample from '../../components/CardExample';
import request from '../../utils/request';
import Button from '../../components/Button';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Example, Links, Pagegination } from '../../types/exam';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/api';
const cx = classNames.bind(styles);
type Page = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    groupPage: Links[];
};
function ExamQuestions() {
    const { showToast } = useGlobalContext();
    const [listExample, setListExample] = useState<Example[]>([]);
    const [page, setPage] = useState<Page>({
        prevPageUrl: null,
        nextPageUrl: null,
        groupPage: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const { state } = useLocation();
    const [params] = useSearchParams();
    const [searchValue, setSearchValue] = useState(params.get('search') || '');

    useEffect(() => {
        setSearchValue(params.get('search') || '');
    }, [state]);

    const search = searchValue;

    const handleChoosePage = (url: string) => {
        request
            .get(url + `&search=${search}`)
            .then((example) => {
                handleChangePage(example.data);
            })
            .catch(() => {});
    };
    const handleChangePage = (example: Pagegination) => {
        const { prev_page_url, next_page_url, links } = example;
        links.shift();
        links.pop();
        window.scrollTo(0, 0);
        setPage({
            prevPageUrl: prev_page_url,
            nextPageUrl: next_page_url,
            groupPage: links,
        });

        setListExample(example?.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const { data } = await request.get<Pagegination>('get-example', {
                    params: { search, orderby: 'desc' },
                });
                handleChangePage(data);
            } catch (error) {
                if (isAxiosError<ApiErrorResponse>(error)) {
                    console.log(error);

                    showToast(error.response?.data.message ?? 'Lỗi kết nối server');
                    console.log('Axios error:', error.response);
                } else {
                    // Lỗi JS khác (Runtime, JSON parse, ...)
                    showToast('Đã xảy ra lỗi không xác định');
                    console.log('Unknown error:', error);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [search]);

    if (isLoading) {
        return (
            <div className={cx('wraper')}>
                <>
                    <CardExample></CardExample>
                    <CardExample></CardExample>
                    <CardExample></CardExample>
                </>
            </div>
        );
    }

    return (
        <div className={cx('wraper')}>
            <div className={cx('container')}>
                {listExample.length > 0 ? (
                    listExample.map((example, index) => {
                        return <CardExample className={cx('child')} key={index} example={example}></CardExample>;
                    })
                ) : (
                    <div className={cx('not-found')}>Không tìm thấy đề thi phù hợp</div>
                )}
            </div>

            <div className={cx('page')}>
                <Button
                    variant="primary"
                    disable={!page.prevPageUrl}
                    onClick={() => {
                        handleChoosePage(page.prevPageUrl ?? '');
                    }}
                >
                    Trang trước
                </Button>
                <div className={cx('group-page')}>
                    {page.groupPage?.map((item, index) => {
                        return (
                            <Button
                                disable={item.active || item.label === '...'}
                                variant="primary"
                                key={index}
                                onClick={() => {
                                    handleChoosePage(item.url ?? '');
                                }}
                            >
                                {item.label}
                            </Button>
                        );
                    })}
                </div>
                <Button
                    variant="primary"
                    disable={!page.nextPageUrl}
                    onClick={() => {
                        handleChoosePage(page.nextPageUrl ?? '');
                    }}
                >
                    Trang tiếp
                </Button>
            </div>
        </div>
    );
}
export default ExamQuestions;
