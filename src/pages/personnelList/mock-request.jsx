import { sleep } from 'antd-mobile/es/utils/sleep'

let count = 0

export async function mockRequest() {
  if (count >= 5) {
    return []
  }
  await sleep(2000)
  count
  return [
    {number:'P1532524',name:'李静',id:'1'},
    {number:'P1772524',name:'诸葛亮',id:'2'},
    {number:'P7532524',name:'刘备',id:'3'},
    {number:'P1532524',name:'张龙',id:'4'},
    {number:'P1207524',name:'磨牙',id:'5'},
    {number:'P1532524',name:'诸葛匀',id:'66'},
    {number:'P4530024',name:'王菲丽',id:'34'},
    {number:'P5535824',name:'李依纯',id:'99'},
  ]
}