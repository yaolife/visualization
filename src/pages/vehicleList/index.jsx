import Header from '@/components/Navbar';
import position from '@/images/position.png';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
import { Button, DotLoading, Image, SearchBar } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized';
import { history } from 'umi';
import styles from './index.less';
import { getCount, setCount } from './sharedState'; // 导入 sharedState

const pageSize = 20000;

const VehicleList = () => {
  const [data, setPerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 新增过滤后的数据状态
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [isFetching, setIsFetching] = useState(false); // 添加 isFetching 状态以防止并发请求
  const [searchQuery, setSearchQuery] = useState(''); // 搜索查询

  const sleepRequest = useCallback(
    async (count) => {
      await sleep(1000); // 模拟网络延迟
      const startIndex = count * pageSize;
      const endIndex = startIndex + pageSize;
      const result = data.slice(startIndex, endIndex);
      return result;
    },
    [data],
  );

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return; // 防止并发请求
    setIsFetching(true);
    setLoading(true);

    try {
      const currentCount = getCount(); // 获取当前的 count 值
      const append = await sleepRequest(currentCount); // 使用 getCount 获取 count

      if (!Array.isArray(append)) {
        append = [];
      }
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
    connectMQTT()
      .then(() => {
        // 订阅主题 车辆列表
        subscribeMQTT('onlineVehicle', (message) => {
          setLoading(true); // 设置 loading 状态为 true
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息onlineVehicle:', parsedMessage);

            // 合并新数据到现有数据中
            setPerData((prevData) => {
              const newData = Array.isArray(parsedMessage) ? parsedMessage : [parsedMessage];
              const updatedDataMap = new Map(prevData.map((item) => [item.vehicleNumber, item]));

              newData.forEach((newItem) => {
                if (updatedDataMap.has(newItem.vehicleNumber)) {
                  // 如果存在相同的 vehicleNumber，则更新该项
                  updatedDataMap.set(newItem.vehicleNumber, {
                    ...updatedDataMap.get(newItem.vehicleNumber),
                    ...newItem,
                  });
                } else {
                  updatedDataMap.set(newItem.vehicleNumber, newItem);
                }
              });

              return Array.from(updatedDataMap.values());
            });
          } catch (error) {
            console.error('Failed to parse message:', error);
          } finally {
            setLoading(false); // 数据更新完成后设置 loading 状态为 false
          }
        });
      })
      .catch((error) => {
        console.error('Failed to connect to MQTT broker:', error);
      });
    // 清理函数，在组件卸载时断开连接
    return () => {
      disconnectMQTT();
    };
  }, []);

  useEffect(() => {
    console.log('useEffect called, calling doSearch');
    doSearch();
  }, [doSearch]);

  const doSearch = useCallback(() => {
    setPerData([]);
    setHasMore(true);
    setCount(0); // 重置计数器
    loadMore();
  }, [loadMore]);

  const filteredDataMemo = useMemo(() => {
    if (searchQuery.trim() === '') {
      return data;
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return data.filter((item) => {
        const vehicleNumber =
          typeof item.vehicleNumber === 'string' ? item.vehicleNumber.toLowerCase() : '';
        const vehicleTypeShow =
          typeof item.vehicleTypeShow === 'string' ? item.vehicleTypeShow.toLowerCase() : '';
        return vehicleNumber.includes(lowerCaseQuery) || vehicleTypeShow.includes(lowerCaseQuery);
      });
    }
  }, [searchQuery, data]);

  useEffect(() => {
    setFilteredData(filteredDataMemo);
  }, [filteredDataMemo]);

  const goVehiclePositioning = useCallback((item) => {
    history.push({
      pathname: '/vehiclePositioning',
      query: item,
    });
  }, []);

  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const item = filteredData[index]; // 使用过滤后的数据

      return (
        <div
          key={key}
          style={style}
          className={styles.singleItem}
          onClick={() => goVehiclePositioning(item)}
        >
          <div className={styles.singleItemLeft}>
            <EnvironmentOutline fontSize={16} />
            {/* <Image src={position} width={16} height={16} fit="fill" /> */}
            <div className={styles.listItem}>{item?.vehicleNumber}</div>
          </div>
          <span>{item?.vehicleTypeShow}</span>
        </div>
      );
    },
    [filteredData, goVehiclePositioning],
  );

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

export default VehicleList;
