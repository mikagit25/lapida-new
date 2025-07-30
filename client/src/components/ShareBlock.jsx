import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ShareBlock = ({ memorial }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Создаем красивый URL из имени мемориала
  const createSlugFromName = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // убираем специальные символы
      .replace(/\s+/g, '-') // заменяем пробелы на дефисы
      .trim();
  };

  // Используем либо custom slug, либо создаем из имени
  const memorialSlug = memorial.customSlug || createSlugFromName(memorial.fullName);
  
  // Для разработки используем localhost, но показываем как будет выглядеть на продакшене
  const isDevelopment = window.location.hostname === 'localhost';
  const shareUrl = isDevelopment 
    ? `${window.location.origin}/memorial/${memorial.shareUrl}` // для разработки используем старый формат
    : `https://lapida.one/${memorialSlug}`; // для продакшена новый формат

  const displayUrl = `lapida.one/${memorialSlug}`; // всегда показываем красивый URL

  const copyToClipboard = async () => {
    try {
      // Копируем полный URL для функциональности
      const urlToCopy = isDevelopment ? shareUrl : `https://${displayUrl}`;
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOnSocialMedia = (platform) => {
    const text = `В память о ${memorial.fullName}`;
    const urlToShare = isDevelopment ? shareUrl : `https://${displayUrl}`;
    const encodedUrl = encodeURIComponent(urlToShare);
    const encodedText = encodeURIComponent(text);

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedText}`
    };

    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Поделиться</h3>
      
      {/* Ссылка для копирования */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ссылка на мемориал
        </label>
        <div className="flex">
          <input
            type="text"
            value={displayUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
            title={shareUrl} // показываем полный URL в tooltip
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-md text-sm font-medium transition-colors ${
              copied 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {copied ? '✓' : 'Копировать'}
          </button>
        </div>
      </div>

      {/* QR код */}
      <div className="mb-4">
        <button
          onClick={() => setShowQR(!showQR)}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {showQR ? 'Скрыть QR код' : 'Показать QR код'}
        </button>
        
        {showQR && (
          <div className="mt-3 text-center">
            <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
              <QRCodeSVG 
                value={isDevelopment ? shareUrl : `https://${displayUrl}`}
                size={128}
                level="M"
                includeMargin={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Сканируйте для быстрого доступа к мемориалу
            </p>
          </div>
        )}
      </div>

      {/* Социальные сети */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Поделиться в социальных сетях
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => shareOnSocialMedia('facebook')}
            className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Facebook
          </button>
          <button
            onClick={() => shareOnSocialMedia('vk')}
            className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            ВКонтакте
          </button>
          <button
            onClick={() => shareOnSocialMedia('telegram')}
            className="flex items-center justify-center px-3 py-2 bg-blue-400 text-white rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Telegram
          </button>
          <button
            onClick={() => shareOnSocialMedia('whatsapp')}
            className="flex items-center justify-center px-3 py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareBlock;
