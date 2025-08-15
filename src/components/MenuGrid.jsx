import React from 'react'

export default function MenuGrid({menu, onAdd, currentCart, search}){
  const filtered = menu.filter(m => m.name.toLowerCase().includes((search||'').toLowerCase()))
  return (
    <div className="menu-grid">
      {filtered.map(item => {
        const added = !!(currentCart||[]).find(c=>c.id===item.id)
        return (
          <div key={item.id} className="menu-item card">
            <div style={{fontWeight:600}}>{item.name}</div>
            <div>₹{item.price}</div>
            <div style={{marginTop:8,display:'flex',gap:8}}>
              <input id={`qty_${item.id}`} defaultValue={1} type="number" min={1} style={{width:60}} />
              <button onClick={() => {
                const q = parseInt(document.getElementById(`qty_${item.id}`).value)||1
                onAdd(item, q)
              }} disabled={added} className="nav-btn">{added? 'Added':'Add'}</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
