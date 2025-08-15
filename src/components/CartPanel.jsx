import React from 'react'

export default function CartPanel({cart, total, onInc, onDec, onClear, onComplete, onPrint, payment, setPayment}){
  return (
    <div className="card">
      <div style={{fontWeight:700}}>Cart</div>
      <div style={{maxHeight:220,overflow:'auto',marginTop:8}}>
        {cart.length===0 ? <div style={{color:'#6b7280'}}>Cart empty</div> : cart.map(ci => (
          <div key={ci.id} className="cart-item">
            <div>
              <div style={{fontWeight:600}}>{ci.name}</div>
              <div style={{fontSize:12}}>₹{ci.price} x {ci.qty}</div>
            </div>
            <div style={{display:'flex',gap:6, alignItems:'center'}}>
              <button onClick={() => onDec(ci.id)} className="nav-btn">−</button>
              <div>{ci.qty}</div>
              <button onClick={() => onInc(ci.id)} className="nav-btn">+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:8}}><strong>Total:</strong> ₹{total}</div>
      <div style={{marginTop:8}}>
        <label>Payment:</label>
        <select value={payment} onChange={e=>setPayment(e.target.value)} style={{marginLeft:8}}>
          <option>Cash</option>
          <option>UPI</option>
        </select>
      </div>
      <div style={{display:'flex',gap:8,marginTop:10}}>
        <button onClick={onClear} className="nav-btn">Clear</button>
        <button onClick={onComplete} className="nav-btn">Complete</button>
        <button onClick={onPrint} className="nav-btn">Print</button>
      </div>
    </div>
  )
}
