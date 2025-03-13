const container = document.querySelector('.ins-api-users');

const style = document.createElement('style');
style.textContent = `
  .ins-api-users {
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .user-card {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 20px;
    width: 300px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
  }

  .user-card:hover {
    transform: translateY(-5px);
  }

  .user-card h3 {
    margin: 0 0 15px 0;
    color: #2c3e50;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-card p {
    margin: 10px 0;
    color: #34495e;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .user-card i {
    width: 20px;
    color: #7f8c8d;
  }

  .delete-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background-color 0.3s;
  }

  .delete-btn:hover {
    background-color: #c0392b;
  }

  .delete-btn i {
    color: white;
  }
`;
document.head.appendChild(style);

function renderUsers(users) {
    container.innerHTML = '';
    users.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';
      
      userCard.innerHTML = `
        <h3><i class="fas fa-user-tie"></i> ${user.name}</h3>
        <p><i class="fas fa-user"></i> ${user.username}</p>
        <p><i class="fas fa-envelope"></i> ${user.email}</p>
        <p><i class="fas fa-map-marker-alt"></i> ${user.address.street}, ${user.address.suite}, ${user.address.city}</p>
        <button class="delete-btn" data-id="${user.id}">
          <i class="fas fa-trash-alt"></i> Sil
        </button>
      `;
      
      userCard.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));
      container.appendChild(userCard);
    });
  }

function deleteUser(userId) {
  const storedData = JSON.parse(localStorage.getItem('usersData'));
  const updatedUsers = storedData.users.filter(user => user.id !== userId);
  
  localStorage.setItem('usersData', JSON.stringify({
    ...storedData,
    users: updatedUsers
  }));
  
  renderUsers(updatedUsers);
}

function fetchData() {
  fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
      if (!response.ok) throw new Error('API bağlantı hatası');
      return response.json();
    })
    .then(users => {
      const storageData = {
        users: users,
        timestamp: new Date().getTime()
      };
      localStorage.setItem('usersData', JSON.stringify(storageData));
      renderUsers(users);
    })
    .catch(error => {
      container.innerHTML = `<div class="error">Hata: ${error.message}</div>`;
    });
}

function checkLocalStorage() {
  const storedData = localStorage.getItem('usersData');
  
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    const isExpired = new Date().getTime() > parsedData.timestamp + (24 * 60 * 60 * 1000);
    
    if (!isExpired) {
      renderUsers(parsedData.users);
      return true;
    }
  }
  return false;
}

if (!checkLocalStorage()) {
  fetchData();
}