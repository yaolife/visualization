import React, { useEffect, useState } from 'react';
import { Button, Image, InfiniteScroll, List, DotLoading, SearchBar } from 'antd-mobile';
import Header from '@/components/Navbar';
import styles from './index.less';
import { mockRequest } from './mock-request';
import position from '@/images/position.png';

const ElectronicFenceList = () => {
  const [data, setFenData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  async function loadMore() {
    const append = await mockRequest();
    setFenData((val) => [...val, ...append]);
    setHasMore(append.length > 0);
  }

  function doSearch() {
    setFenData([]);
    setHasMore(true);
    loadMore();
  }

  useEffect(() => {
    doSearch();
  }, []);

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
      {data.length > 0 ? (
        <>
          <List>
            {data.map((item, index) => (
              <div key={index} className={styles.singleItem}>
                {' '}
                <div className={styles.singleItemLeft}>
                  <Image src={position} width={16} height={16} fit="fill" />
                  <List.Item>{item?.number}</List.Item>
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </List>
          <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.loadingWrapper}>
            <DotLoading />
          </div>
          正在拼命加载数据
        </div>
      )}
    </>
  );
};
export default ElectronicFenceList;
