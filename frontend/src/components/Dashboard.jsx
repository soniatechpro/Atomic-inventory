import React from 'react';
import { ShoppingCart, Server, Cpu, AlertTriangle, Layers } from 'lucide-react';

export default function Dashboard({ item, loading, onPurchase }) {
  const isOutOfStock = item ? item.stock <= 0 : true;

  return (
    <div className="dashboard-card" style={{
      width: '100%',
      maxWidth: '420px',
      padding: '28px',
      borderRadius: '24px',
      background: 'rgba(30, 41, 59, 0.7)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
      border: '1px solid #334155',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#0f172a', padding: '8px', borderRadius: '12px', display: 'flex' }}>
            <Server size={18} color="#38bdf8" />
          </div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', letterSpacing: '-0.025em', color: '#cbd5e1' }}>Node Cluster v1.0</h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 14px', borderRadius: '99px', border: '1px solid #22c55e33' }}>
          <span className="live-pulse" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
          <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Sync</span>
        </div>
      </div>

      {!item ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: '24px', height: '24px', border: '3px solid #334155', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px auto' }}></div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>Connecting to atomic socket stream...</p>
        </div>
      ) : (
        <div>
          {/* Main Stock Card */}
          <div style={{
            background: '#0f172a',
            padding: '24px',
            borderRadius: '18px',
            border: `1px solid ${isOutOfStock ? '#ef444444' : '#1e293b'}`,
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ background: isOutOfStock ? '#311c1c' : '#1e293b', padding: '14px', borderRadius: '14px', display: 'flex' }}>
                <Cpu size={28} color={isOutOfStock ? '#f87171' : '#38bdf8'} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#f1f5f9' }}>{item.item_name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ color: '#38bdf8', fontSize: '22px', fontWeight: '700' }}>${item.price}</span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>/ unit</span>
                </div>
              </div>
            </div>

            <hr style={{ borderColor: '#1e293b', margin: '20px 0', borderStyle: 'solid', borderWidth: '1px 0 0 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '14px' }}>
                <Layers size={14} />
                <span>Available Stock Pool</span>
              </div>
              <span style={{ 
                fontSize: '26px', 
                fontWeight: '800', 
                fontVariantNumeric: 'tabular-nums',
                color: isOutOfStock ? '#f87171' : item.stock <= 3 ? '#fbbf24' : '#4ade80'
              }}>
                {item.stock} <span style={{ fontSize: '12px', fontWeight: '500', color: '#64748b' }}>units</span>
              </span>
            </div>

            {isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.08)', color: '#f87171', padding: '12px', borderRadius: '10px', marginTop: '16px', fontSize: '13px', border: '1px solid #ef444422' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>Atomic zero reached. Core transactions are locked.</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onPurchase}
            disabled={isOutOfStock || loading}
            className="purchase-btn"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background: isOutOfStock ? '#1e293b' : '#0284c7',
              color: isOutOfStock ? '#475569' : '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isOutOfStock || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {loading ? (
              <>
                {/* Embedded dynamic spinner graphic */}
                <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff44', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                <span>Executing Atomic Lock...</span>
              </>
            ) : isOutOfStock ? (
              <span>Sold Out</span>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Purchase Sequence</span>
              </>
            )}
          </button>
        </div>
      )}
      
      {/* Adding native keyframe spin inline for compatibility */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}