import { sleep } from 'antd-mobile/es/utils/sleep'

let count = 0

export async function mockRequest() {
  if (count >= 5) {
    return []
  }
  await sleep(2000)
  count++
  return [
    {plate:'粤A985839',model:'商务车',id:'1'},
    {plate:'粤B877646',model:'大巴',id:'2'},
    {plate:'粤A985552',model:'小汽车',id:'3'},
    {plate:'粤A98583',model:'商务车',id:'4'},
    {plate:'粤C835664',model:'小汽车',id:'5'},
    {plate:'粤D985830',model:'大巴',id:'66'},
    {plate:'粤A968343',model:'商务车',id:'34'},
    {plate:'粤F985837',model:'运输车',id:'99'},
  ]
}