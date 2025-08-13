// Проверка прав на редактирование мемориала
const checkEditPermission = (memorial, userId) => {
  if (!memorial || !userId) return false;
  
  // Создатель всегда может редактировать
  if (memorial.createdBy && memorial.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  // Проверяем, есть ли пользователь в списке редакторов
  if (memorial.editorsUsers && memorial.editorsUsers.length > 0) {
    return memorial.editorsUsers.some(editorId => 
      editorId.toString() === userId.toString()
    );
  }
  
  return false;
};

// Проверка прав на просмотр мемориала
const checkViewPermission = (memorial, userId = null) => {
  if (!memorial) return false;
  
  // Публичные мемориалы доступны всем
  if (!memorial.isPrivate) return true;
  
  // Если нет пользователя, доступ запрещен к приватным
  if (!userId) return false;
  
  // Создатель всегда может просматривать
  if (memorial.createdBy && memorial.createdBy.toString() === userId.toString()) {
    return true;
  }
  
  // Проверяем, есть ли пользователь в списке разрешенных
  if (memorial.allowedUsers && memorial.allowedUsers.length > 0) {
    return memorial.allowedUsers.some(allowedId => 
      allowedId.toString() === userId.toString()
    );
  }
  
  // Редакторы тоже могут просматривать
  if (memorial.editorsUsers && memorial.editorsUsers.length > 0) {
    return memorial.editorsUsers.some(editorId => 
      editorId.toString() === userId.toString()
    );
  }
  
  return false;
};

module.exports = {
  checkEditPermission,
  checkViewPermission
};
