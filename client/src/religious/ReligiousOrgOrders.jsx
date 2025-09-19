// Управление заказами товаров и услуг религиозной организации
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousOrderService from '../services/religiousOrderService';
import OrderForm from './OrderForm';
import OrderListItem from './OrderListItem';

const initialOrder = {
  customerName: '',
  product: '',
  quantity: 1,
  status: 'pending',
  comment: '',
};





const ReligiousOrgOrders = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const statusOptions = [
    { value: 'pending', label: t('religiousOrgOrders.status.pending') },
    { value: 'processing', label: t('religiousOrgOrders.status.processing') },
    { value: 'completed', label: t('religiousOrgOrders.status.completed') },
    { value: 'cancelled', label: t('religiousOrgOrders.status.cancelled') },
  ];
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialOrder);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка заказов при монтировании
  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    // Можно объединить заказы на услуги и товары, если нужно
    Promise.all([
      religiousOrderService.getServiceOrdersByOrg(orgId),
      religiousOrderService.getProductOrdersByOrg(orgId)
    ])
      .then(([serviceOrders, productOrders]) => {
        setOrders([...serviceOrders, ...productOrders]);
      })
  .catch(() => setError(t('religiousOrgOrders.loadError')))
      .finally(() => setLoading(false));
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let newOrder;
      if (editId) {
        // Для примера: если есть поле product, обновляем заказ на товар, иначе на услугу
        if (form.product) {
          newOrder = await religiousOrderService.updateProductOrder(editId, { ...form, organization: orgId });
        } else {
          newOrder = await religiousOrderService.updateServiceOrder(editId, { ...form, organization: orgId });
        }
        setOrders(orders.map(o => (o._id === editId ? newOrder : o)));
        setEditId(null);
        setEditIndex(null);
      } else {
        if (form.product) {
          newOrder = await religiousOrderService.createProductOrder({ ...form, organization: orgId });
        } else {
          newOrder = await religiousOrderService.createServiceOrder({ ...form, organization: orgId });
        }
        setOrders([...orders, newOrder]);
      }
      setForm(initialOrder);
    } catch (err) {
  setError(t('religiousOrgOrders.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(orders[idx]);
    setEditIndex(idx);
    setEditId(orders[idx]._id);
  };

  const handleDelete = async (idx) => {
    const id = orders[idx]._id;
    setLoading(true);
    setError('');
    try {
      if (orders[idx].product) {
        await religiousOrderService.removeProductOrder(id);
      } else {
        await religiousOrderService.removeServiceOrder(id);
      }
      setOrders(orders.filter((_, i) => i !== idx));
      if (editIndex === idx) {
        setEditIndex(null);
        setEditId(null);
      }
    } catch (err) {
  setError(t('religiousOrgOrders.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>{t('religiousOrgOrders.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <OrderForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialOrder); setEditIndex(null); setEditId(null); }}
        isOwner={isOwner}
        t={t}
        statusOptions={statusOptions}
      />
      <ul className="order-list">
        {orders.map((o, idx) => (
          <OrderListItem
            key={o._id || idx}
            order={o}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
            onSelect={() => {}}
            statusOptions={statusOptions}
          />
        ))}
      </ul>
    </section>
  );
};

export default ReligiousOrgOrders;
