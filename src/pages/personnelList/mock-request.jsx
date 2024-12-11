// mock-request.jsx
import { sleep } from 'antd-mobile/es/utils/sleep';

const pageSize = 20000;

const allData = [
  {
    "personId": "R009",
    "personName": "维修人员2",
    "department": "软件部门",
    "orgName": null,
    "personType": "1",
    "personTypeShow": "员工"
  },
  {
    "personId": "R001",
    "personName": "巡视人员1",
    "department": "软件部门",
    "orgName": null,
    "personType": "1",
    "personTypeShow": "员工"
  },
  {
    "personId": "TEST_0",
    "personName": "测试0",
    "department": "部门",
    "orgName": "50505123",
    "personType": "1",
    "personTypeShow": "员工"
  },
  {
    "personId": "P001",
    "personName": "张三",
    "department": "硬件部门",
    "orgName": "50505124",
    "personType": "2",
    "personTypeShow": "实习生"
  },
  {
    "personId": "P002",
    "personName": "李四",
    "department": "硬件部门",
    "orgName": "50505124",
    "personType": "2",
    "personTypeShow": "实习生"
  },
  {
    "personId": "P003",
    "personName": "王五",
    "department": "硬件部门",
    "orgName": "50505124",
    "personType": "2",
    "personTypeShow": "实习生"
  },
  {
    "personId": "Q001",
    "personName": "赵六",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q002",
    "personName": "孙七",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q003",
    "personName": "周八",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q001",
    "personName": "赵六",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q002",
    "personName": "孙七",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q003",
    "personName": "周八",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q001",
    "personName": "赵六",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q002",
    "personName": "孙七",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q003",
    "personName": "周八",
    "department": "市场部门",
    "orgName": "50578888",
    "personType": "3",
    "personTypeShow": "田"
  },
  {
    "personId": "Q001",
    "personName": "赵六",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q002",
    "personName": "孙七",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q003",
    "personName": "周八",
    "department": "市场部门",
    "orgName": "50578888",
    "personType": "3",
    "personTypeShow": "田"
  },
  {
    "personId": "Q001",
    "personName": "赵六",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q002",
    "personName": "孙七",
    "department": "市场部门",
    "orgName": "50505125",
    "personType": "3",
    "personTypeShow": "外包"
  },
  {
    "personId": "Q003",
    "personName": "田颖瑶",
    "department": "市场部门",
    "orgName": "505788555",
    "personType": "3",
    "personTypeShow": "田颖瑶"
  },
  {
    "personId": "Q003",
    "personName": "田伯光",
    "department": "市场部门",
    "orgName": "505788555",
    "personType": "3",
    "personTypeShow": "田颖4"
  },
  // 可以继续添加更多的数据
];

export async function mockRequest(count) { // 接受 count 作为参数
  await sleep(1000);
  const startIndex = count * pageSize;
  const endIndex = startIndex + pageSize;
  const result = allData.slice(startIndex, endIndex);
  console.log(`mockRequest called with count: ${count}, startIndex: ${startIndex}, endIndex: ${endIndex}, result:`, result);
  return result;
}