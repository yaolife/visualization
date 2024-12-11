// index.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { history } from 'umi';
import {
  List as VirtualizedList,
  AutoSizer,
  WindowScroller,
} from 'react-virtualized';
import { Button, Image, DotLoading, SearchBar } from 'antd-mobile';
import Header from '@/components/Navbar';
import styles from './index.less';
import { mockRequest } from './mock-request';
import position from '@/images/position.png';
import { getCount, setCount } from './sharedState'; // 导入 sharedState

const VehicleList = () => {
  const [data, setPerData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [isFetching, setIsFetching] = useState(false); // 添加 isFetching 状态以防止并发请求

// index.jsx
const loadMore = useCallback(async () => {
  if (isFetching || !hasMore) return; // 防止并发请求
  setIsFetching(true);
  setLoading(true);
  try {
    const currentCount = getCount(); // 获取当前的 count 值
    console.log(`loadMore called with count: ${currentCount}`);
    const append = await mockRequest(currentCount); // 使用 getCount 获取 count
    console.log(`Data appended:`, append);
    setPerData((val) => [...val, ...append]);
    setHasMore(append.length > 0);
    setCount(currentCount + 6); // 更新 count，增加 pageSize 的值
    console.log(`count updated to: ${getCount()}`);
  } finally {
    setIsFetching(false);
    setLoading(false);
  }
}, [isFetching, hasMore]);

  useEffect(() => {
    console.log('useEffect called, calling doSearch');
    doSearch();
  }, [doSearch]);
  
  const doSearch = useCallback(() => {
    setPerData([]);
    setHasMore(true);
    setCount(0); // 重置计数器
    console.log('doSearch called, resetting count to 0');
    loadMore();
  }, [loadMore]);

// index.jsx
const rowRenderer = ({ key, index, style }) => {
  const item = data[index];
  return (
    <div key={key} style={style} className={styles.singleItem} onClick={() => goVehiclePositioning(item)}>
      <div className={styles.singleItemLeft}>
        <Image src={position} width={16} height={16} fit="fill" />
        <div className={styles.listItem}>{item?.vehicleNumber}</div>
      </div>
      <span>{item?.vehicleTypeShow}</span>
    </div>
  );
};



  const goVehiclePositioning = (item) => {
    history.push({
      pathname: '/vehiclePositioning',
      query: item,
    });
  };
// index.jsx
return (
  <>
    <div className={styles.header}>
      <Header />
      <div className={styles.searchBar}>
        <div className={styles.left}>
          <SearchBar />
        </div>
        <div className={styles.right}>
          <Button size="small" color="primary" onClick={doSearch}>
            搜索
          </Button>
        </div>
      </div>
    </div>
    {loading && data.length === 0 ? (
      <div className={styles.placeholder}>
        <div className={styles.loadingWrapper}>
          <DotLoading />
        </div>
        正在拼命加载数据
      </div>
    ) : (
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <VirtualizedList
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={data.length}
                rowHeight={50}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
                width={width}
                onRowsRendered={({ startIndex, stopIndex }) => {
                  if (stopIndex >= data.length - 1 && hasMore) {
                    loadMore();
                  }
                }}
              />
            )}
          </AutoSizer>
        )}
      </WindowScroller>
    )}
    {!hasMore && (
      <div className={styles.noMore}>
        没有更多数据了
      </div>
    )}
  </>
);
};

export default VehicleList;