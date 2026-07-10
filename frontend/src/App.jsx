import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { fetchCurrentStatus, executePurchase, connectSocketStream } from './services/inventory.service';
import { CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]); // Dynamic Notification Array Queue

  // Helper function to dynamically add toasts that auto-dismiss after 3 seconds
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const data = await fetchCurrentStatus();
        setItem(data);
      } catch (err) {
        showToast('API Connection failure. Check backend server.', 'error');
      }
    };

    getInitialData();

    // Socket data broadcast stream hook listener
    const disconnectStream = connectSocketStream((updatedItem) => {
      setItem((prevItem) => {
        // If someone else bought it, notify current user on the fly!
        if (prevItem && prevItem.stock > updatedItem.stock && !loading) {
          showToast(`Another client purchased 1 unit. Global stock level shifted!`, 'info');
        }
        return updatedItem;
      });
    });

    return () => disconnectStream();
  }, [loading]);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const responseData = await executePurchase();
      setItem(responseData.item);
      showToast('Atomic lock passed! Secure transaction confirmed.', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Dashboard item={item} loading={loading} onPurchase={handlePurchase} />

      {/* Floating Toast Notification Container Layer */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 9999
      }}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="toast-animate"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: '12px',
              background: toast.type === 'success' ? '#065f46' : toast.type === 'error' ? '#991b1b' : '#1e3a8a',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
              border: `1px solid ${toast.type === 'success' ? '#10b98144' : toast.type === 'error' ? '#ef444444' : '#3b82f644'}`,
              minWidth: '280px',
              maxWidth: '360px'
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={18} color="#34d399" /> : <XCircle size={18} color="#f87171" />}
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}