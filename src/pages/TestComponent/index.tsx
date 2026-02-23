import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState } from 'react';

interface Post {
    id: number;
    title: string;
}

export default function InfiniteScrollPage() {
    const [items, setItems] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=3`);
        const data: Post[] = await res.json();

        setItems((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);

        if (data.length === 0) {
            setHasMore(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div id="scrollableDiv" style={{ height: 100, overflow: 'auto' }}>
            <InfiniteScroll
                dataLength={items.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Đang tải...</h4>}
                endMessage={<p style={{ textAlign: 'center' }}>Hết dữ liệu</p>}
                scrollableTarget="scrollableDiv"
            >
                {items.map((item) => (
                    <div key={item.id}>{item.title}</div>
                ))}
            </InfiniteScroll>
        </div>
    );
}
