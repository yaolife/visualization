
//格式化时间
export const formatDateTime = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const addOneMonthToCurrentDate = () => {
  const currentDate = new Date();
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
  
  // 如果下个月的日期超出了当月的最大天数，则自动调整为下个月的最后一日
  if (nextMonth.getMonth() !== (currentDate.getMonth() + 1) % 12) {
    nextMonth.setDate(0); // 设置为上个月的最后一天
  }

  // 将时间设置为当天的同一时间
  nextMonth.setHours(currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds(), currentDate.getMilliseconds());

  // 返回 ISO 字符串格式
  return nextMonth.toISOString();
};