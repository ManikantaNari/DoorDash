export function initFormInteractions() {
  const storageAvailable = (type) => {
      try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
      } catch (e) {
        return false;
      }
    };
  
    const hasLocalStorage = storageAvailable('localStorage');
    const hasSessionStorage = storageAvailable('sessionStorage');
    const storageStatusEl = document.getElementById('storageStatus');
  
    let offers = [];
    let storageMethod = null;
  
    if (hasLocalStorage) {
      try {
        const saved = localStorage.getItem('offers');
        offers = saved ? JSON.parse(saved) : Array(100).fill('accepted');
        storageMethod = 'localStorage';
      } catch {
        offers = Array(100).fill('accepted');
      }
    } else if (hasSessionStorage) {
      try {
        const saved = sessionStorage.getItem('offers');
        offers = saved ? JSON.parse(saved) : Array(100).fill('accepted');
        storageMethod = 'sessionStorage';
      } catch {
        offers = Array(100).fill('accepted');
      }
    } else {
      offers = Array(100).fill('accepted');
      storageStatusEl.textContent = 'Warning: No storage available. Data will not persist between sessions.';
    }
  
    const btnAccept = document.getElementById('btnAccept');
    const btnDecline = document.getElementById('btnDecline');
    const acceptanceRateElement = document.getElementById('acceptanceRate');
    const offerCountElement = document.getElementById('offerCount');
    const editIndexInput = document.getElementById('editIndex');
    const btnMarkAccepted = document.getElementById('btnMarkAccepted');
    const btnMarkDeclined = document.getElementById('btnMarkDeclined');
    const offerGrid = document.getElementById('offerGrid');
  
    function saveOffers() {
      try {
        if (hasLocalStorage) {
          localStorage.setItem('offers', JSON.stringify(offers));
          storageMethod = 'localStorage';
          return true;
        } else if (hasSessionStorage) {
          sessionStorage.setItem('offers', JSON.stringify(offers));
          storageMethod = 'sessionStorage';
          return true;
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
      storageStatusEl.textContent = 'Warning: Unable to save data. Changes will not persist.';
      return false;
    }
  
    function addOffer(status) {
      offers = [status, ...offers].slice(0, 100);
      saveOffers();
      updateUI();
    }
  
    function updateOffer(index, status) {
      if (index >= 0 && index < offers.length) {
        offers[index] = status;
        saveOffers();
        updateUI();
      }
    }
  
    function handleManualUpdate(status) {
      const index = parseInt(editIndexInput.value) - 1;
      if (!isNaN(index) && index >= 0 && index < offers.length) {
        updateOffer(index, status);
        editIndexInput.value = '';
      }
    }
  
    function updateUI() {
      const acceptedCount = offers.filter((o) => o === 'accepted').length;
      const acceptanceRate = Math.round((acceptedCount / offers.length) * 100);
      acceptanceRateElement.textContent = `Acceptance Rate: ${acceptanceRate}%`;
      offerCountElement.textContent = `Based on last ${offers.length} offer${offers.length !== 1 ? 's' : ''}.`;
  
      offerGrid.innerHTML = '';
      offers.forEach((status, index) => {
        const item = document.createElement('div');
        item.className = `offer-item ${status === 'accepted' ? 'offer-accepted' : 'offer-declined'}`;
        item.textContent = index + 1;
        offerGrid.appendChild(item);
      });
  
      if (storageMethod) {
        storageStatusEl.textContent = `Data stored using ${storageMethod}`;
      }
    }
  
    btnAccept.addEventListener('click', () => addOffer('accepted'));
    btnDecline.addEventListener('click', () => addOffer('declined'));
    btnMarkAccepted.addEventListener('click', () => handleManualUpdate('accepted'));
    btnMarkDeclined.addEventListener('click', () => handleManualUpdate('declined'));
  
    updateUI();
  }
  