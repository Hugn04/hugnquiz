import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

import styles from './ExamQuestions.module.scss';
import CardExample from '../../components/CardExample';
import request from '../../utils/request';
import Button from '../../components/Button';
import { useLocation, useSearchParams } from 'react-router-dom';
import type { Example, Links, Pagegination } from '../../types/exam';
const cx = classNames.bind(styles);
type Page = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    groupPage: Links[];
};
function ExamQuestions() {
    const [listExample, setListExample] = useState<Example[]>([]);
    const [page, setPage] = useState<Page>({
        prevPageUrl: null,
        nextPageUrl: null,
        groupPage: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
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
                const example = await request.get('get-example', { params: { search } });
                handleChangePage(example.data);
                setIsLoading(false);
            } catch (error) {
                setIsError(true);
                console.log(error);
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
