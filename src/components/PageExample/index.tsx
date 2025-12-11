import classNames from 'classnames/bind';
import { useCallback, useEffect, useState } from 'react';

import styles from './PageExample.module.scss';
import CardExample from '../../components/CardExample';
import request from '../../utils/request';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import type { Example, Links, Pagegination, Sector } from '../../types/exam';
import images from '../../assets/images';
import Select from '../Select';
import { useSearchParams } from 'react-router-dom';
const cx = classNames.bind(styles);
type Page = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    groupPage: Links[];
};
type PageExampleProps = {
    url: 'get-example' | 'get-myexample' | 'get-favorite';
};

type FilterType = {
    search: string;
    sector: string;
    orderBy: 'count_test' | 'updated_at';
    sort: 'desc' | 'asc';
};

type OrderType = { name: string; value: 'count_test' | 'updated_at' };

const orderList: OrderType[] = [
    { name: 'Số lượt thi', value: 'count_test' },
    { name: 'Ngày tạo', value: 'updated_at' },
];

function PageExample({ url = 'get-favorite' }: PageExampleProps) {
    const [page, setPage] = useState<Page>({
        prevPageUrl: null,
        nextPageUrl: null,
        groupPage: [],
    });
    const [searchParams, setSearchParams] = useSearchParams();

    // const page = searchParams.get('page')

    const [sectorList, setSectorList] = useState<Sector[]>([]);
    const [listMyExample, setListMyExample] = useState<Example[]>([]);
    const [search, setSearch] = useState<FilterType>({
        search: searchParams.get('search') ?? '',
        sector: searchParams.get('sector') ?? '',
        orderBy: (searchParams.get('orderBy') as 'count_test' | 'updated_at') ?? 'count_test',
        sort: (searchParams.get('sort') as 'asc' | 'desc') ?? 'desc',
        // page: searchParams.get('page') ?? '1',
    });

    // const [sortList, setSortList] = useState({});
    // useEffect(() => {
    //     const pageNumber = +(searchParams.get('page') ?? '1');
    //     console.log(page.groupPage[pageNumber - 1].url, searchParams.get('page'));
    // }, [searchParams]);
    const [isLoading, setIsLoading] = useState(false);
    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const getExample = useCallback(
        async (page?: string) => {
            setIsLoading(true);
            try {
                const example = await request.get(url, { params: page ? { ...search, page: page } : search });
                handleChangePage(example.data);
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
                toast('Không thể kết nối tới server');
            }
        },
        [search, url],
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
        getExample(searchParams.get('page') ?? '1');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, searchParams]);
    const handleChangeNumberPage = (url: string) => {
        if (isValidUrl(url)) {
            const params = new URL(url).searchParams;
            const pageNumber = params.get('page') ?? '1';
            setSearchParams(
                (params) => {
                    const merged = new URLSearchParams(params);
                    merged.set('page', pageNumber);

                    return merged;
                },
                { replace: false },
            );
            getExample(pageNumber);
        }
    };
    useEffect(() => {
        const fetchSector = async () => {
            try {
                const { data: sectors } = await request.get<Sector[]>('/sectors');
                setSectorList(sectors);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSector();
    }, []);
    const defaultOrder = orderList.filter((item) => {
        return item.value === search.orderBy;
    });
    return (
        <div className={cx('wrapper')}>
            <div className={cx('filter')}>
                <Input
                    title="Tìm kiếm"
                    defaultValue={searchParams.get('search') || ''}
                    placeholder="Tìm theo tên"
                    handleDebounce={(value) => {
                        // updateURL({ ...search, search: value, page: '1' });
                        setSearch((prev) => ({ ...prev, search: value }));
                    }}
                ></Input>
                <Select<Sector>
                    canClose
                    title="Ngành"
                    items={sectorList}
                    placeholder="Lọc theo ngành"
                    filter={(items, search) => items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))}
                    render={(item) => item.name}
                    onSelect={(item) => {
                        setSearch((prev) => ({ ...prev, sector: item ? String(item.id) : '' }));
                    }}
                />

                <div className={cx('sort')}>
                    <Select<OrderType>
                        title="Sắp xếp theo"
                        defaultValue={defaultOrder[0]}
                        items={orderList}
                        placeholder="Lọc ngày tạo"
                        filter={(items, search) =>
                            items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
                        }
                        render={(item) => item.name}
                        onSelect={(item) => {
                            setSearch((prev) => ({ ...prev, orderBy: item ? item.value : 'count_test' }));
                        }}
                    />
                    <Select<{ name: string; value: 'asc' | 'desc' }>
                        defaultValue={{ name: 'Giảm dần', value: 'desc' }}
                        filter={(items) => items}
                        items={[
                            { name: 'Tăng dần', value: 'asc' },
                            { name: 'Giảm dần', value: 'desc' },
                        ]}
                        placeholder="Lọc số lượt thi"
                        render={(item) => item.name}
                        onSelect={(item) => {
                            setSearch((prev) => ({ ...prev, sort: item ? item.value : 'desc' }));
                        }}
                    />
                </div>
            </div>
            <div className={cx('content')}>
                {isLoading ? (
                    <>
                        <CardExample></CardExample>
                        <CardExample></CardExample>
                        <CardExample></CardExample>
                    </>
                ) : listMyExample.length === 0 ? (
                    <div className={cx('not-found')}>
                        <img src={images.notCard} alt="" />
                        <span>Không có đề thi nào</span>
                    </div>
                ) : (
                    <>
                        {listMyExample.map((example, index) => {
                            return (
                                <CardExample
                                    getExample={getExample}
                                    key={index}
                                    example={example}
                                    myExample={url === 'get-myexample'}
                                ></CardExample>
                            );
                        })}
                    </>
                )}
            </div>
            <div className={cx('page')}>
                <Button
                    variant="primary"
                    disable={!page.prevPageUrl}
                    onClick={() => {
                        if (page.prevPageUrl) handleChangeNumberPage(page.prevPageUrl);
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
                                    if (page.url) handleChangeNumberPage(page.url);
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
                        if (page.nextPageUrl) handleChangeNumberPage(page.nextPageUrl);
                    }}
                >
                    Trang tiếp
                </Button>
            </div>
        </div>
    );
}

export default PageExample;
