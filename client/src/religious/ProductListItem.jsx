import React from 'react';

const ProductListItem = ({ product, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={product._id || idx}>
    <b>{product.name}</b> — {product.description} {product.price && `| ${product.price}₽`} {product.available ? '' : `(${t('religiousOrgProducts.unavailable')})`}
    {product.image && <img src={product.image} alt={product.name} style={{ maxWidth: 40, maxHeight: 40, marginLeft: 8 }} />}
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default ProductListItem;
