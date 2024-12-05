import { sleep } from 'antd-mobile/es/utils/sleep'

let count = 0

export async function mockRequest() {
  if (count >= 5) {
    return []
  }
  await sleep(2000)
  count++
  return [
    {number:'默认围栏1',name:'2024-10-15至2024-10-16',id:'1'},
    {number:'默认围栏2',name:'2024-10-15至2024-10-16',id:'2'},
    {number:'默认围栏3',name:'2024-10-15至2024-10-16',id:'3'},
    {number:'默认围栏4',name:'已失效',id:'4'},
    {number:'默认围栏5',name:'2024-10-15至2024-10-16',id:'5'},
    {number:'默认围栏6',name:'已失效',id:'66'},
    {number:'默认围栏7',name:'2024-10-15至2024-10-16',id:'34'},
    {number:'默认围栏8',name:'已失效',id:'99'},
  ]
}