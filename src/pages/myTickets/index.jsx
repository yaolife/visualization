import React, { useState, useEffect } from 'react';
import { Image, Button } from 'antd-mobile';
import { history, useLocation } from 'umi';
import UsModal from '@/components/UsModal';
import TicketItem from '@/components/TicketItem';
import { getTicketList } from '@/services/services';
import { AutoSizer, List as VirtualizedList, WindowScroller } from 'react-virtualized';
import Layout from '@/layout';
import whiteJob from '@/images/whiteJob.png';
import styles from './index.less';

const MyTicket = () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [ticketList, setTicketList] = useState([
		{
			"id": "1861652379991715841",
			"qmnum": "200000457568",
			"qmtxt": "阳江通知单0508",
			"qmart": "NG",
			"priok": "4",
			"priokx": "提高关注",
			"erdat": "20240508",
			"tplnr": "YJ-1-06-RCP-009MT",
			"assignStatus": "1",
			"assignStatusShow": "已指派",
			"workStatus": "可作业",
			"workStatusShow": null,
			"workOrderId": "1861652379991715841",
			"areaId": null,
			"areaName": null,
			"floorId": null,
			"floorNumber": null,
			"roomId": null,
			"roomNumber": null,
			"equipmentNo": null,
			"equipmentName": null,
			"startDate": "2024-09-20 10:42:19",
			"endDate": "2024-09-30 10:42:24",
			"lstGeoFences": [
				{
					"workOrderId": "1861652379991715841",
					"fenceId": "1863768215052034049",
					"fenceName": "测测围栏3",
					"validFrom": "2024-12-03 01:00:00",
					"validTo": "2024-12-04 12:00:00"
				}
			],
			"lstPerson": [
				{
					"personId": "R004",
					"personName": "巡视人员4",
					"department": "软件部门",
					"trackingCardId": "34543534",
					"workOrderId": "1861652379991715841"
				}
			],
			"msaus": null,
			"strmn": "20240508",
			"ltrmn": "00000000"
		},
		{
			"id": null,
			"qmnum": null,
			"qmtxt": null,
			"qmart": null,
			"priok": null,
			"priokx": null,
			"erdat": null,
			"tplnr": null,
			"assignStatus": null,
			"assignStatusShow": null,
			"workStatus": "可作业",
			"workStatusShow": null,
			"workOrderId": "1838393433044234241",
			"areaId": null,
			"areaName": null,
			"floorId": null,
			"floorNumber": null,
			"roomId": null,
			"roomNumber": null,
			"equipmentNo": null,
			"equipmentName": null,
			"startDate": "2024-09-24 09:41:58",
			"endDate": "2024-09-24 09:42:01",
			"lstGeoFences": [
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1863768215052034049",
					"fenceName": "测测围栏3",
					"validFrom": "2024-12-03 01:00:00",
					"validTo": "2024-12-04 12:00:00"
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1863761826732818433",
					"fenceName": "测测围栏2",
					"validFrom": null,
					"validTo": null
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1863761258165493761",
					"fenceName": "测测围栏1",
					"validFrom": null,
					"validTo": null
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1863759510108127234",
					"fenceName": "测试围栏111",
					"validFrom": null,
					"validTo": null
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1862069040555954177",
					"fenceName": "测试围栏4",
					"validFrom": null,
					"validTo": null
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "1862038269095006210",
					"fenceName": "测试围栏",
					"validFrom": null,
					"validTo": null
				},
				{
					"workOrderId": "1838393433044234241",
					"fenceId": "274640680780697601",
					"fenceName": "可进入电子围栏",
					"validFrom": null,
					"validTo": null
				}
			],
			"lstPerson": [
				{
					"personId": "R004",
					"personName": "巡视人员4",
					"department": "软件部门",
					"trackingCardId": "12314",
					"workOrderId": "1838393433044234241"
				}
			],
			"msaus": null,
			"strmn": null,
			"ltrmn": null
		},
		{
			"id": null,
			"qmnum": null,
			"qmtxt": null,
			"qmart": null,
			"priok": null,
			"priokx": null,
			"erdat": null,
			"tplnr": null,
			"assignStatus": null,
			"assignStatusShow": null,
			"workStatus": "可作业",
			"workStatusShow": null,
			"workOrderId": "ZY20240921002",
			"areaId": null,
			"areaName": null,
			"floorId": null,
			"floorNumber": null,
			"roomId": null,
			"roomNumber": null,
			"equipmentNo": null,
			"equipmentName": null,
			"startDate": "2024-09-20 10:42:19",
			"endDate": "2024-09-30 10:42:24",
			"lstGeoFences": [
				{
					"workOrderId": "ZY20240921002",
					"fenceId": "274640680780697601",
					"fenceName": "可进入电子围栏",
					"validFrom": null,
					"validTo": null
				}
			],
			"lstPerson": [
				{
					"personId": "R004",
					"personName": "巡视人员4",
					"department": "软件部门",
					"trackingCardId": null,
					"workOrderId": "ZY20240921002"
				}
			],
			"msaus": null,
			"strmn": null,
			"ltrmn": null
		}
	]);

  useEffect(() => {
    // 获取票务列表
    const fetchTicketList = async () => {
      try {
        const response = await getTicketList({ personId: 'P970203' });
        if (response.code === '0') {
          setTicketList(response.data);
        } else {
          console.error('Failed to fetch ticket list:', response.msg);
        }
      } catch (error) {
        console.error('Error fetching ticket list:', error);
      }
    };

    fetchTicketList();
  }, []);

  const receiveCard = () => {
    setVisible(true);
  };
  const handleConfirm = (value) => {
    setVisible(false);
  };
  const clickReceiveCard = () => {
    setVisible(true);
  };
  return (
    <>
      <div className={styles.ticketTitle}>
        <Image src={whiteJob} width={24} height={24} fit="fill" />
        <span>我的作业票</span>
      </div>
      <div className={styles.myTicket}>
        <div className={styles.ticketData}>
          {
            ticketList.map((item) => (
              <TicketItem
                key={item.workOrderId}
                item={item}
                clickReceiveCard={clickReceiveCard}
              />
            ))
          }        
        </div>
        <Layout />
      </div>
      <UsModal
        visible={visible}
        content={'领取成功!'}
        showCloseButtonFlag={false}
        handleConfirm={handleConfirm}
      />
    </>
  );
};

export default MyTicket;
