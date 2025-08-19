import React from 'react';
import CompanyGallery from './CompanyGallery';

function CompanyGalleryBlock({ companyId, gallery, isOwner, onImagesUpdate }) {
  return (
    <div>
      <CompanyGallery
        companyId={companyId}
        images={gallery}
        isOwner={isOwner}
        onImagesUpdate={onImagesUpdate}
      />
    </div>
  );
}

export default CompanyGalleryBlock;
