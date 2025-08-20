import React from 'react';

const OrderCard = ({ order, onCancel, onRepeat }) => {
  if (!order) return null;
  const companyName = order.companyId?.name || 'Компания';
  const companySlug = order.companyId?.customSlug;
  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    shipped: 'bg-purple-100 text-purple-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  const statusLabel = {
    new: 'Новый',
    pending: 'В обработке',
    confirmed: 'Подтверждён',
    shipped: 'Отправлен',
    completed: 'Завершён',
    cancelled: 'Отменён'
  };
  const total = order.items?.reduce((sum, item) => sum + (item.productId?.price ?? item.price) * item.quantity, 0) || 0;
  return (
    <div className="order-card shadow-lg rounded-xl p-6 bg-white mb-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>{statusLabel[order.status] || order.status}</span>
        {order.companyId ? (
          <a
            href={companySlug ? `/company/${companySlug}` : `/companies/${order.companyId._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-lg text-blue-700 hover:underline cursor-pointer transition"
          >
            {companyName}
          </a>
        ) : (
          <span className="font-bold text-lg">{companyName}</span>
        )}
        <span className="text-gray-500 text-sm">{new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <div className="order-items grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {order.items?.map(item => {
          const slug = item.productId?.slug;
          const productUrl = slug ? `/products/${slug}` : null;
          const images = item.productId?.images || [];
          const imageUrl = images.length > 0 ? images[0] : null;
          return (
            <div key={slug || item.productId?._id || item.productId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border">
              {imageUrl ? (
                <a href={productUrl} target="_blank" rel="noopener noreferrer">
                  <img src={imageUrl} alt={item.productId?.name || item.name} className="w-16 h-16 object-cover rounded border-2 border-gray-300 hover:border-blue-400 transition cursor-pointer" />
                </a>
              ) : (
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-gray-400 border-2 border-gray-300">Нет фото</div>
              )}
              <div className="flex-1">
                {productUrl ? (
                  <a href={productUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline cursor-pointer transition">
                    {item.productId?.name || item.name}
                  </a>
                ) : (
                  <span className="font-semibold">{item.productId?.name || item.name}</span>
                )}
                <div className="text-sm text-gray-600">Цена: {item.productId?.price ?? item.price} ₽</div>
                <div className="text-sm text-gray-600">Кол-во: {item.quantity}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-gray-700 font-semibold">Сумма заказа: <span className="text-xl">{total} ₽</span></div>
        <div className="flex gap-2">
          <button onClick={() => onCancel(order)} disabled={order.status === 'cancelled'} className={`px-4 py-2 rounded font-semibold transition ${order.status === 'cancelled' ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}>Отменить</button>
          <button onClick={() => onRepeat(order)} className="px-4 py-2 rounded font-semibold bg-blue-500 text-white hover:bg-blue-600 transition">Повторить</button>
        </div>
      </div>
      {order.comment && <div className="mt-2 text-gray-500 text-sm">Комментарий: {order.comment}</div>}
    </div>
  );
};

export default OrderCard;
