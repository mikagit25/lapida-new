import React, { useState } from 'react';
import { createOrder } from '../services/crmService';

const OrderButtonCRM = ({ productId, userId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        productId,
        contactId: userId,
        status: 'New',
      };
      await createOrder(orderData);
      setSuccess(true);
    } catch (e) {
      setError('Ошибка при создании заказа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleOrder} disabled={loading || success} style={{ padding: '8px 16px' }}>
        {loading ? 'Оформление...' : success ? 'Заказ оформлен!' : 'Заказать'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default OrderButtonCRM;
