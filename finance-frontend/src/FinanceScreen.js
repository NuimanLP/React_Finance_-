import logo from './logo.svg';
import './App.css';
import moment from 'moment';
import TransactionList from './components/TransactionList';
import AddItem from './components/AddItem';
import { useState, useEffect } from 'react';
import { Divider, Typography } from 'antd';

import { Spin } from 'antd';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:1337"
const URL_TXACTIONS = '/api/txactions'

function FinanceScreen() {
  const [isLoading, setIsLoading] = useState(false) //state loading try TRUE
  const [transactionData, setTransactionData] = useState([])
  const [currentAmount, setCurrentAmount] = useState(0)
  const addItem = async (item) => {
    try {
      setIsLoading(true)
      console.log(item.amount)
      const params = {
        action_datetime: moment(),
        amount: item.amount,
        type: item.type,
        note: item.note,
      }
      const response = await axios.post(URL_TXACTIONS, { data: params })
      const { id, attributes } = response.data.data
      console.log(id, attributes.note)

      setTransactionData([...transactionData,//spread operation 
      {
        id: id,
        key: id,
        action_datetime: attributes.action_datetime,
        type: attributes.type,
        note: attributes.note,
        amount: attributes.amount,

      }
      ])

    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(URL_TXACTIONS)

      //................ Add Code Here ...................

      const newData = response.data.data.map(d => {
        return {
          id: d.id,
          key: d.id,
          action_datetime: d.attributes.action_datetime,
          type: d.attributes.type,
          note: d.attributes.note,
          amount: d.attributes.amount,

        }
      })



      setTransactionData(response.data.data.map(d => ({
        id: d.id,
        key: d.id,
        ...d.attributes
      })))
    } catch (err) {
      console.log(err)
    } finally { setIsLoading(false) }
  }

  const deleteItem = async (itemId) => {
    try {
      setIsLoading(true)
      await axios.delete('${URL_TXACTIONS}/${itemId}')
      fetchItems()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchItems()
  }, [])
  useEffect(() => {
    setCurrentAmount(transactionData.reduce(
      (sum, d) => sum = d.type === "income" ? sum + d.amount : sum - d.amount
      , 0))
  }
    , [transactionData])


  return (
    <div className="App">
      <header className="App-header">
        <Spin spinning={isLoading}>
          <Typography.Title>
            จํานวนเงินปัจจุบัน {currentAmount} บาท
          </Typography.Title>

          <AddItem onItemAdded={addItem} />
          <Divider>บันทึกรายรับ-รายจ่าย</Divider>
          <TransactionList data={transactionData}
            onTransactionDeleted={deleteItem} />
        </Spin>
      </header>
    </div>
  );
}

export default FinanceScreen;