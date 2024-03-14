import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, InputNumber, Button } from 'antd';

const EditItem = ({ isOpen, item, onItemEdited, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      console.log("Editing item:", item);
      form.setFieldsValue(item);
    }
  }, [isOpen, item, form]);

  const handleFormSubmit = () => {
    form.validateFields().then((formData) => {
      const updatedItemWithID = { ...formData, id: item.id };
      onItemEdited(updatedItemWithID);
    }).catch((error) => {
      console.error('Validation Failed:', error);
    });
  };


  return (
    <Modal
      title="Edit Item"
      visible={isOpen}
      onOk={handleFormSubmit}
      onCancel={onCancel}
      okText="Submit"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="type"
          label="ชนิด"
          rules={[{ required: true, message: 'Please select a type!' }]}
        >
          <Select
            allowClear
            options={[
              {
                value: 'income',
                label: 'รายรับ',
              },
              {
                value: 'expense',
                label: 'รายจ่าย',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="amount"
          label="จำนวนเงิน"
          rules={[{ required: true, message: 'Please input the amount!' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="จำนวนเงิน" />
        </Form.Item>
        <Form.Item
          name="note"
          label="หมายเหตุ"
          rules={[{ required: true, message: 'Please input a note!' }]}
        >
          <Input placeholder="Note" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditItem;
