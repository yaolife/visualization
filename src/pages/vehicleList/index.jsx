import Header from '@/components/Navbar';
import position from '@/images/position.png';
import { connectMQTT, disconnectMQTT, subscribeMQTT } from '@/services/services';
import { Button, DotLoading, Image, SearchBar } from 'antd-mobile';
import { sleep } from 'antd-mobile/es/utils/sleep';
import { useCallback, useEffect, useState } from 'react';
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized';
import { history } from 'umi';
import styles from './index.less';
import { getCount, setCount } from './sharedState'; // 导入 sharedState

const pageSize = 20000;
const VehicleList = () => {
  const [data, setPerData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [isFetching, setIsFetching] = useState(false); // 添加 isFetching 状态以防止并发请求

  const sleepRequest = useCallback(async (count) => {
    await sleep(1000); // 模拟网络延迟
    const startIndex = count * pageSize;
    const endIndex = startIndex + pageSize;
    const result = data.slice(startIndex, endIndex);
    console.log(
      `sleepRequest called with count: ${count}, startIndex: ${startIndex}, endIndex: ${endIndex}, result:`,
      result,
    );
    return result;
  }, [data]);
  
  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore) return; // 防止并发请求
    setIsFetching(true);
    setLoading(true);
  
    try {
      const currentCount = getCount(); // 获取当前的 count 值
      console.log(`loadMore called with count: ${currentCount}`);
      const append = await sleepRequest(currentCount); // 使用 getCount 获取 count
  
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
    connectMQTT('ws://broker.emqx.io:8083/mqtt')
      .then(() => {
        // 订阅主题 人员列表
        subscribeMQTT('onlineVehicle', (message) => {
          console.log('订阅的信息:', message);
          try {
            const parsedMessage = JSON.parse(message);
            console.log('解析后的消息onlineVehicle:', parsedMessage);

            // 合并新数据到现有数据中
            setPerData((prevData) => {
              const newData = Array.isArray(parsedMessage) ? parsedMessage : [parsedMessage];
              const updatedData = prevData.reduce((acc, item) => {
                const existingItemIndex = newData.findIndex(newItem => newItem.vehicleNumber === item.vehicleNumber);
                if (existingItemIndex !== -1) {
                  // 如果存在相同的 vehicleNumber，则更新该项
                  acc.push({ ...item, ...newData[existingItemIndex] });
                  newData.splice(existingItemIndex, 1); // 移除已处理的项
                } else {
                  acc.push(item);
                }
                return acc;
              }, []);

              // 添加剩余的新数据
              updatedData.push(...newData);

              // 去重， vehicleNumber就是唯一标识
              const uniqueData = Array.from(new Map(updatedData.map(item => [item.vehicleNumber, item])).values());
              return uniqueData;
            });
          } catch (error) {
            console.error('Failed to parse message:', error);
          }
        });

        // 清理函数，在组件卸载时断开连接
        return () => {
          disconnectMQTT();
        };
      })
      .catch((error) => {
        console.log(error, 'error');
        console.error('Failed to connect to MQTT broker:', error);
      });
  }, []);

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
      {!hasMore && <div className={styles.noMore}>没有更多数据了</div>}
    </>
  );
};

export default VehicleList;