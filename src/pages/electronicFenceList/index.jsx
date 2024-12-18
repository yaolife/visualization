import Header from '@/components/Navbar';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { Button, DotLoading, Image, SearchBar } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useCallback, useEffect, useState } from 'react';
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized';
import { history } from 'umi';
import styles from './index.less';
import { getCount, setCount } from './sharedState'; // 导入 sharedState

const pageSize = 20000;
const ElectronicFenceList = () => {
  const [data, setPerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 新增过滤后的数据状态
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [isFetching, setIsFetching] = useState(false); // 添加 isFetching 状态以防止并发请求
  const [searchQuery, setSearchQuery] = useState(''); // 搜索查询

  const sleepRequest = useCallback(
    async (count) => {
      if (data.length > 0) {
        await sleep(1000);
        const startIndex = count * pageSize;
        const endIndex = startIndex + pageSize;
        const result = data.slice(startIndex, endIndex);
        console.log(
          `sleepRequest called with count: ${count}, startIndex: ${startIndex}, endIndex: ${endIndex}, result:`,
          result,
        );
        return result;
      }
      // 如果数据为空，返回一个空数组
      return [];
    },
    [data],
  );

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return; // 防止并发请求
    setIsFetching(true);
    setLoading(true);
    try {
      const currentCount = getCount(); // 获取当前的 count 值
      console.log(`loadMore called with count: ${currentCount}`);
      const append = await sleepRequest(currentCount); // 使用 getCount 获取 count

      // 确保 append 是一个数组
      if (!Array.isArray(append)) {
        console.warn('append is not an array:', append);
        append = [];
      }

      console.log(`Data appended:`, append);
      setPerData((val) => [...val, ...append]);
      setHasMore(append.length > 0);
      setCount(currentCount + 6); // 更新 count，增加 pageSize 的值
      console.log(`count updated to: ${getCount()}`);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [isFetching, hasMore, sleepRequest, setPerData, setHasMore, setIsFetching, setLoading]);

  useEffect(() => {
    // 连接到 MQTT 代理
    const connectAndSubscribe = async () => {
      try {
        await connectMQTT();
        // 订阅主题 电子围栏列表
        subscribeMQTT('onlinePerson', (message) => {
          console.log('订阅的信息:', message);
          setLoading(true); // 设置 loading 状态为 true

          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息onlinePerson:', parsedMessage);

            // 合并新数据到现有数据中
            setPerData((prevData) => {
              const newData = Array.isArray(parsedMessage) ? parsedMessage : [parsedMessage];
              const updatedData = prevData.reduce((acc, item) => {
                const existingItemIndex = newData.findIndex(
                  (newItem) => newItem.personId === item.personId,
                );
                if (existingItemIndex !== -1) {
                  // 如果存在相同的 personId，则更新该项
                  acc.push({ ...item, ...newData[existingItemIndex] });
                  newData.splice(existingItemIndex, 1); // 移除已处理的项
                } else {
                  acc.push(item);
                }
                return acc;
              }, []);

              // 添加剩余的新数据
              updatedData.push(...newData);

              // 去重，personId 就是唯一标识
              const uniqueData = Array.from(
                new Map(updatedData.map((item) => [item.personId, item])).values(),
              );
              return uniqueData;
            });
          } catch (error) {
            console.error('Failed to parse message:', error);
          } finally {
            setLoading(false); // 数据更新完成后设置 loading 状态为 false
          }
        });
      } catch (error) {
        console.error('Failed to connect to MQTT broker:', error);
        setLoading(false); // 连接失败后设置 loading 状态为 false
      }
    };

    connectAndSubscribe();

    // 清理函数，在组件卸载时断开连接
    return () => {
      disconnectMQTT();
    };
  }, []); // 空依赖数组确保只在组件挂载和卸载时执行

  useEffect(() => {
    setLoading(true); // 初始加载时设置 loading 为 true
    console.log('useEffect called, calling doSearch');
    doSearch();
  }, [doSearch]);

  const doSearch = useCallback(() => {
    setPerData([]);
    setHasMore(true);
    setCount(0); // 重置计数器
    console.log('doSearch called, resetting count to 0');
    setLoading(true); // 确保在调用 loadMore 之前设置 loading 为 true
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filteredData = data.filter((item) => {
        const orgName = typeof item.orgName === 'string' ? item.orgName.toLowerCase() : '';
        const personName = typeof item.personName === 'string' ? item.personName.toLowerCase() : '';
        return orgName.includes(lowerCaseQuery) || personName.includes(lowerCaseQuery);
      });
      setFilteredData(filteredData);
    }
  }, [searchQuery, data]);

  const rowRenderer = ({ key, index, style }) => {
    const item = filteredData[index]; // 使用过滤后的数据
    return (
      <div
        key={key}
        style={style}
        className={styles.singleItem}
        onClick={() => goPersonnelTrajectory(item)}
      >
        <div className={styles.singleItemLeft}>
          <EnvironmentOutline fontSize={16} />
          <div className={styles.listItem}>{item?.orgName}</div>
        </div>
        <span>{item?.personName}</span>
      </div>
    );
  };

  const goPersonnelTrajectory = (item) => {
    history.push({
      pathname: '/personnelTrajectory',
      query: item,
    });
  };

  return (
    <>
      <div className={styles.header}>
        <Header />
        <div className={styles.searchBar}>
          <div className={styles.left}>
            <SearchBar
              placeholder="搜索..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
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
                  rowCount={filteredData.length} // 使用过滤后的数据长度
                  rowHeight={50}
                  rowRenderer={rowRenderer}
                  scrollTop={scrollTop}
                  width={width}
                  onRowsRendered={({ startIndex, stopIndex }) => {
                    if (stopIndex >= filteredData.length - 1 && hasMore) {
                      loadMore();
                    }
                  }}
                />
              )}
            </AutoSizer>
          )}
        </WindowScroller>
      )}
      {!hasMore && <div className={styles.noMore}>没有更多数据了</div>}
    </>
  );
};

export default ElectronicFenceList;
