// Скрипт для mongo shell или mongosh
// Исправляет абсолютные ссылки на фото в событиях TimelineEvent на относительные

const absUrlPattern = /https?:\/\/[^/]+(\/upload\/timeline\/[^"']+)/;

const cursor = db.TimelineEvent.find({ 'photos.url': { $regex: '^https?://.*/upload/timeline/' } });
let count = 0;

while (cursor.hasNext()) {
  const doc = cursor.next();
  let changed = false;
  const newPhotos = (doc.photos || []).map(photo => {
    if (photo.url && absUrlPattern.test(photo.url)) {
      const rel = photo.url.match(absUrlPattern)[1];
      changed = true;
      return { ...photo, url: rel };
    }
    return photo;
  });
  if (changed) {
    db.TimelineEvent.updateOne({ _id: doc._id }, { $set: { photos: newPhotos } });
    count++;
  }
}

print('Исправлено событий:', count);
