export function saveDataOnLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function clearLocalStorageData(key) {
    localStorage.removeItem(key);
}

export function readLocalStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}
