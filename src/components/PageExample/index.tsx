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
const cx = classNames.bind(styles);
type Page = {
    prevPageUrl: string | null;
    nextPageUrl: string | null;
    groupPage: Links[];
};
type PageExampleProps = {
    url: 'get-example' | 'get-myexample' | 'get-favorite';
};
function PageExample({ url = 'get-favorite' }: PageExampleProps) {
    const [page, setPage] = useState<Page>({
        prevPageUrl: null,
        nextPageUrl: null,
        groupPage: [],
    });
    const [sectorList, setSectorList] = useState<Sector[]>([]);
    const [listMyExample, setListMyExample] = useState<Example[]>([]);
    const [search, setSearch] = useState({ search: '', sector: '', test: '', date: '' });
    const [isLoading, setIsLoading] = useState(false);
    const getExample = useCallback(
        async (pageUrl: string = url) => {
            setIsLoading(true);
            try {
                const example = await request.get(pageUrl, { params: search });
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
        getExample();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
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
    return (
        <div className={cx('wrapper')}>
            <div className={cx('filter')}>
                <Input
                    title="Tìm kiếm"
                    placeholder="Tìm theo tên"
                    handleDebounce={(value) => {
                        setSearch((prev) => ({ ...prev, search: value }));
                    }}
                ></Input>

                <div className={cx('sort')}>
                    <Select<Sector>
                        canClose
                        title="Ngành"
                        items={sectorList}
                        placeholder="Lọc theo ngành"
                        filter={(items, search) =>
                            items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
                        }
                        render={(item) => item.name}
                        onSelect={(item) => {
                            setSearch((prev) => ({ ...prev, sector: item ? String(item.id) : '' }));
                        }}
                    />
                    <Select<{ name: string; value: 'asc' | 'desc' }>
                        canClose
                        title="Ngày tạo"
                        items={[
                            { name: 'Mới tới cũ', value: 'desc' },
                            { name: 'Cũ tới mới', value: 'asc' },
                        ]}
                        placeholder="Lọc ngày tạo"
                        filter={(items, search) =>
                            items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
                        }
                        render={(item) => item.name}
                        onSelect={(item) => {
                            setSearch((prev) => ({ ...prev, date: item ? String(item.value) : '' }));
                        }}
                    />
                    <Select<{ name: string; value: 'asc' | 'desc' }>
                        canClose
                        title="Số lượt thi"
                        filter={(items) => items}
                        items={[
                            { name: 'Tăng dần', value: 'asc' },
                            { name: 'Giảm dần', value: 'desc' },
                        ]}
                        placeholder="Lọc số lượt thi"
                        render={(item) => item.name}
                        onSelect={(item) => {
                            setSearch((prev) => ({ ...prev, test: item ? String(item.value) : '' }));
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
    );
}

export default PageExample;
