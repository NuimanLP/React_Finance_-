import { Space, Table, Tag, Button } from 'antd';
import moment from 'moment';

export default function TransactionList(props) {
  const columns = [
    {
      key: 'id',
      title: 'Date-Time',
      dataIndex: 'action_datetime',

    },
    {
      key: 'id',
      title: 'Type',
      dataIndex: 'type',
      render: type => type === 'income' ? <Tag color='green'>รายรับ</Tag> : <Tag color='red'>รายจ่าย</Tag>
    },
    {
      key: 'id',
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      key: 'id',
      title: 'Note',
      dataIndex: 'note',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => props.onTransactionEdit(record)}>Edit</Button>
          <Button onClick={() => props.onTransactionDeleted(record.id)}>Delete</Button>
        </Space>
      ),

    },
  ];

  return (
    <Table columns={columns} dataSource={props.data} />
  )
}
