interface OfflineArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  savedAt?: number;
}

class OfflineStorage {
  private dbName = 'devnote-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('articles')) {
          const store = db.createObjectStore('articles', { keyPath: 'id' });
          store.createIndex('savedAt', 'savedAt', { unique: false });
        }
      };
    });
  }

  async saveArticle(article: OfflineArticle): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['articles'], 'readwrite');
      const store = transaction.objectStore('articles');
      const request = store.put({ ...article, savedAt: Date.now() });
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getArticle(id: string): Promise<OfflineArticle | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['articles'], 'readonly');
      const store = transaction.objectStore('articles');
      const request = store.get(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async getAllArticles(): Promise<OfflineArticle[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['articles'], 'readonly');
      const store = transaction.objectStore('articles');
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async removeArticle(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['articles'], 'readwrite');
      const store = transaction.objectStore('articles');
      const request = store.delete(id);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async isArticleSaved(id: string): Promise<boolean> {
    const article = await this.getArticle(id);
    return article !== null;
  }
}

export const offlineStorage = new OfflineStorage();