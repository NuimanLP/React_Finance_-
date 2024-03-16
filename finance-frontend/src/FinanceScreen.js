import React, { useState, useEffect } from 'react';
import { Divider, Typography, Spin } from 'antd';
import axios from 'axios';
import moment from 'moment';
import AddItem from './components/AddItem';
import TransactionList from './components/TransactionList';
import EditItem from './components/EditItem';

const URL_TXACTIONS = '/api/txactions';

function FinanceScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [editingItem, setEditingItem] = useState(null); // New state

  
  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(URL_TXACTIONS);
      setTransactionData(response.data.data.map(d => ({
        id: d.id,
        key: d.id,
        ...d.attributes
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (itemdata) => {
    setIsLoading(true);
    try {
      const params = {
        action_datetime: moment(),
        amount: itemdata.amount,
        type: itemdata.type,
        note: itemdata.note,
      };
      await axios.post(URL_TXACTIONS, { data: params });
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${URL_TXACTIONS}/${itemId}`);
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /*Add-on พี่เต้ย*/
  const updateItem = async (itemdata) => {
    setIsLoading(true);
    try {
      console.log('updateItem', itemdata)
      await axios.put(`${URL_TXACTIONS}/${itemdata.id}`, { data: itemdata });
      setEditingItem(null); // Close modal after updating
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentAmount(transactionData.reduce((sum, d) => d.type === "income" ? sum + d.amount : sum - d.amount, 0));
  }, [transactionData]);

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>จำนวนเงินปัจจุบัน {currentAmount} บาท</Typography.Title>
          <AddItem onItemAdded={addItem} />
          <Divider>บันทึกรายรับ-รายจ่าย</Divider>
          <TransactionList
            data={transactionData}// fetch มาจาก API
            // { id: 1, type: 'รายรับ', amount: 50, note: 'เงินเดือน' },
            // { id: 2, type: 'รายจ่าย', amount: 20, note: 'ค่าอาหารกลางวัน' }
            onTransactionDeleted={deleteItem} //<button Onlcik deleteItem{transactionData.id}>
            /// Add-on พี่เต้ย
            onTransactionEdit={setEditingItem} //<button setEditingItem{transactionData}>
          />
          <EditItem
            isOpen={editingItem}
            itemdata={editingItem}
            ItemEdited={updateItem}
            onCancel={() => setEditingItem(null)}
          />
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;
