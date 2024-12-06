import React from 'react';
import { Button, Card } from 'antd-mobile';
import styles from './index.less';

const TicketItem = (props) => {
   const { title,content } = props.item;
  return (
    <div
      className={styles.ticketItem}
    >
      <div className={styles.ticketItemLeft}>
          {title}
      </div>
      <div className={styles.ticketItemRight}>
      {content}
      </div>
    </div>
  );
};

export default TicketItem;
