(function() {
    var appendLocation = '#user-container';
  
    var container = document.querySelector(appendLocation);
    if (!container) {
      container = document.createElement('div');
      if (appendLocation.startsWith('#')) {
        container.id = appendLocation.slice(1);
      } else if (appendLocation.startsWith('.')) {
        container.className = appendLocation.slice(1);
      }
      document.body.appendChild(container);
    }
  
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = `
      ${appendLocation} {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
        font-family: Arial, sans-serif;
      }
      .user-item {
        background-color: #fff;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .user-item span {
        font-size: 16px;
        color: #333;
      }
      button {
        padding: 6px 12px;
        background-color: #007BFF;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #0056b3;
      }
      #reload-users-btn {
        background-color: #28a745;
        margin-top: 10px;
        display: block;
      }
    `;
    document.head.appendChild(style);
  
    var storageKey = 'usersData';
    var cacheDuration = 1000 * 60 * 60; 
  
    function renderUsers(users) {
      var container = document.querySelector(appendLocation);
      if (!container) {
        console.error('Belirtilen container bulunamadı:', appendLocation);
        return;
      }
      container.innerHTML = '';
  
      users.forEach(function(user) {
        var userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.dataset.userId = user.id;
  
        var userInfo = document.createElement('span');
        userInfo.textContent = user.name + ' (' + user.email + ')';
        userDiv.appendChild(userInfo);
  
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Sil';
        deleteBtn.style.marginLeft = '10px';
        deleteBtn.addEventListener('click', function() {
          container.removeChild(userDiv);
          var cached = getCachedUsers();
          if (cached) {
            var updatedUsers = cached.filter(function(u) {
              return u.id !== user.id;
            });
            saveUsersToCache(updatedUsers);
          }
        });
        userDiv.appendChild(deleteBtn);
  
        container.appendChild(userDiv);
      });
    }
  
    function getCachedUsers() {
      var cachedData = localStorage.getItem(storageKey);
      if (cachedData) {
        try {
          var parsed = JSON.parse(cachedData);
          if (parsed.expire && Date.now() < parsed.expire && Array.isArray(parsed.data)) {
            return parsed.data;
          }
        } catch (e) {
          console.error('Cache verisi okunurken hata:', e);
        }
      }
      return null;
    }
    function saveUsersToCache(users) {
      var dataToStore = {
        data: users,
        expire: Date.now() + cacheDuration
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToStore));
    }

    function fetchUsers() {
      var cached = getCachedUsers();
      if (cached) {
        console.log('Kullanıcılar cache\'den yüklendi.');
        renderUsers(cached);
      } else {
        console.log('API\'den kullanıcılar çekiliyor.');
        fetch('https://jsonplaceholder.typicode.com/users')
          .then(function(response) {
            return response.json();
          })
          .then(function(users) {
            saveUsersToCache(users);
            renderUsers(users);
          })
          .catch(function(error) {
            console.error('Kullanıcılar çekilirken hata oluştu:', error);
            var dummyUsers = [
              { id: 1, name: 'John Doe', email: 'john@example.com' },
              { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
            ];
            saveUsersToCache(dummyUsers);
            renderUsers(dummyUsers);
          });
      }
    }

    function observeContainer() {
      var container = document.querySelector(appendLocation);
      if (!container) {
        console.error('Belirtilen container bulunamadı:', appendLocation);
        return;
      }
      var observer = new MutationObserver(function() {
        var userItems = container.querySelectorAll('.user-item');
        var reloadBtn = container.querySelector('#reload-users-btn');
        if (userItems.length === 0 && !reloadBtn) {
          if (!sessionStorage.getItem('usersReloaded')) {
            var btn = document.createElement('button');
            btn.id = 'reload-users-btn';
            btn.textContent = 'Kullanıcıları Yeniden Yükle';
            btn.style.display = 'block';
            btn.style.marginTop = '10px';
            btn.addEventListener('click', function() {
              if (!sessionStorage.getItem('usersReloaded')) {
                sessionStorage.setItem('usersReloaded', 'true');
                if (btn.parentNode) {
                  btn.parentNode.removeChild(btn);
                }
                localStorage.removeItem(storageKey);
                fetchUsers();
              } else {
                alert('Bu buton zaten kullanıldı.');
              }
            });
            container.appendChild(btn);
          }
        } else if (userItems.length > 0 && reloadBtn) {
          container.removeChild(reloadBtn);
        }
      });
      observer.observe(container, { childList: true });
    }
    fetchUsers();
    observeContainer();
  })();
  