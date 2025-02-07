import React, { useEffect } from 'react';
import { Modal, Form, Select, Input, InputNumber} from 'antd';

const EditItem = ({ isOpen, itemdata, ItemEdited, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isOpen) {
      console.log("Editing itemdata:", itemdata);
      form.setFieldsValue(itemdata);
    }
  }, [itemdata]);

  const handleFormSubmit = () => {
    form.validateFields().then((formData) => {
      console.log('EditItem form data:', formData);
      const updatedItemWithID = { ...formData, id: itemdata.id };
      ItemEdited(updatedItemWithID);
      console.log('updatedItemWithID:', updatedItemWithID);
    }).catch((error) => {
      console.error('Validation Failed:', error);
    });
  };


  return (
    <Modal
      title="Edit Transaction"
      visible={isOpen}
      onOk={handleFormSubmit}
      onCancel={onCancel}
      okText="Submit"
      cancelText="Cancel"
    >
      <Form form={form} layout="horizontal">
        <Form.Item
          name="type"
          label="ชนิด"
          rules={[{ required: true}]}
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
          rules={[{ required: true, message: 'เท่าไหร่ ไอหนุ่ม!' }]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="จำนวนเงิน" />
        </Form.Item>
        <Form.Item
          name="note"
          label="หมายเหตุ"
          rules={[{ required: true, message: 'โปรดใส่หมายเหตุด้วยฮะ!' }]}
        >
          <Input placeholder="Note" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditItem;
