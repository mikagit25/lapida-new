import React from 'react';

const OrderForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t, statusOptions }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="order-form">
      <input name="customerName" value={form.customerName} onChange={onChange} placeholder={t('religiousOrgOrders.customerName')} required />
      <input name="product" value={form.product} onChange={onChange} placeholder={t('religiousOrgOrders.product')} />
      <input name="quantity" value={form.quantity} onChange={onChange} type="number" min="1" />
      <select name="status" value={form.status} onChange={onChange}>
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <textarea name="comment" value={form.comment} onChange={onChange} placeholder={t('religiousOrgOrders.comment')} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default OrderForm;
