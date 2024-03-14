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
  const [editingItem, setEditingItem] = useState(null); // New state for managing the item to edit

  
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

  const addItem = async (item) => {
    setIsLoading(true);
    try {
      const params = {
        action_datetime: moment(),
        amount: item.amount,
        type: item.type,
        note: item.note,
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

  const updateItem = async (item) => {
    setIsLoading(true);
    try {
      console.log('updateItem', item)
      await axios.put(`${URL_TXACTIONS}/${item.id}`, { data: item });
      setEditingItem(null); // Close modal after updating
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    setCurrentAmount(transactionData.reduce((sum, d) => d.type === "income" ? sum + d.amount : sum - d.amount, 0));
  }, [transactionData]);

  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>จำนวนเงินปัจจุบัน {currentAmount} บาท</Typography.Title>
          <AddItem onItemAdded={addItem} />
          <Divider>บันทึกรายรับ-รายจ่าย</Divider>
          <TransactionList 
            data={transactionData} 
            onTransactionDeleted={deleteItem}
            onTransactionEdit={setEditingItem} // Pass function to set item for editing
          />
          <EditItem 
            isOpen={!!editingItem} 
            item={editingItem} 
            onItemEdited={updateItem} 
            onCancel={() => setEditingItem(null)}
          />
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;
