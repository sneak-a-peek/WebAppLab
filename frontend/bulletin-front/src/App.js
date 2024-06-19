import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdList() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState(null);
  const [createForm, setCreateForm] = useState({ title: '', description: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/ads')
      .then(response => {
        setAds(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleDeleteAd = (id) => {
    axios.delete(`http://localhost:5000/ads/${id}`)
      .then(() => {
        setAds(ads.filter(ad => ad.id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleEditAd = (ad) => {
    setEditingAd(ad);
  };

  const handleCreateAd = () => {
    axios.post('http://localhost:5000/ads', createForm)
      .then(response => {
        setAds([...ads, response.data]);
        setCreateForm({ title: '', description: '' });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUpdateAd = () => {
    axios.put(`http://localhost:5000/ads/${editingAd.id}`, editingAd)
      .then(() => {
        setAds(ads.map(ad => ad.id === editingAd.id ? editingAd : ad));
        setEditingAd(null);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>Рекламные объявления</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {ads.map((ad) => (
            <li key={ad.id}>
              <h2>{ad.title}</h2>
              <p>{ad.description}</p>
              <button onClick={() => handleDeleteAd(ad.id)}>Удалить</button>
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
      )}
    </div>
  );
}

export default AdList;