import React, { useState } from 'react';

function AdList() {
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);
  const [createForm, setCreateForm] = useState({ title: '', description: '' });

  const handleDeleteAd = () => {
    // Simulate deletion by removing the ad from the state
    setAds(ads.filter(ad => ad.id !== editingAd));
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
  };

  const handleCreateAd = () => {
    // Add a new ad to the state
    setAds([...ads, { id: Date.now(), title: createForm.title, description: createForm.description }]);
    setCreateForm({ title: '', description: '' });
  };

  const handleUpdateAd = () => {
    // Update the edited ad in the state
    setAds(ads.map(ad => ad.id === editingAd.id ? { ...ad, title: editingAd.title, description: editingAd.description } : ad));
    setEditingAd(null);
  };

  return (
    <div>
      <h1>Рекламные объявления</h1>
      <ul>
        {ads.map((ad) => (
          <li key={ad.id}>
            <h2>{ad.title}</h2>
            <p>{ad.description}</p>
            <button onClick={() => handleDeleteAd()}>Удалить</button>
            <button onClick={() => handleEditAd(ad)}>Редактировать</button>
          </li>
        ))}
        <li>
          <h2>Создать</h2>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateAd();
            }}
          >
            <input
              type="text"
              value={createForm.title}
              onChange={(event) =>
                setCreateForm({ ...createForm, title: event.target.value })
              }
              placeholder="Название"
            />
            <input
              type="text"
              value={createForm.description}
              onChange={(event) =>
                setCreateForm({ ...createForm, description: event.target.value })
              }
              placeholder="Описание"
            />
            <button type="submit">Создать</button>
          </form>
        </li>
        {editingAd && (
          <li>
            <h2>Редактирование</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleUpdateAd();
              }}
            >
              <input
                type="text"
                value={editingAd.title}
                onChange={(event) =>
                  setEditingAd({ ...editingAd, title: event.target.value })
                }
                placeholder="Название"
              />
              <input
                type="text"
                value={editingAd.description}
                onChange={(event) =>
                  setEditingAd({ ...editingAd, description: event.target.value })
                }
                placeholder="Описание"
              />
              <button type="submit">Сохранить</button>
            </form>
          </li>
        )}
      </ul>
    </div>
  );
}

export default AdList;