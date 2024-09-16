import React, { useState } from 'react';

function ServiceForm({ origin, destination }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form ở đây
    console.log({ name, email, origin, destination, agreed });
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Họ và tên"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          required
        />
        <label htmlFor="terms">Tôi đồng ý với các điều khoản và điều kiện</label>
      </div>
      <button type="submit">Đặt dịch vụ</button>
    </form>
  );
}

export default ServiceForm;