import { sleep } from 'antd-mobile/es/utils/sleep'

let count = 0

export async function mockRequest() {
  if (count >= 5) {
    return []
  }
  await sleep(2000)
  count
  return[
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
    }
]
    
}