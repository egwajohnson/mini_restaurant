export const otpTemplate = (data: {
  name: string;
  otp: string;
  message: string;
}) => {
  return `
 <html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #6e8efb, #a777e3);
      padding: 20px;
      color: #333;
      margin: 0;
    }
    .container {
      background-color: #fff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      max-width: 600px;
      margin: auto;
      text-align: center;
    }
    .header {
      background: linear-gradient(90deg, #ff6b6b, #feca57);
      padding: 20px;
      border-radius: 12px 12px 0 0;
      color: #fff;
      margin: -40px -40px 20px -40px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .otp {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
      background: linear-gradient(90deg, #ff6b6b, #feca57);
      padding: 20px;
      border-radius: 8px;
      letter-spacing: 2px;
      margin: 20px 0;
      display: inline-block;
    }
    h2 {
      color: #4a4a4a;
    }
    p {
      line-height: 1.6;
      color: #555;
    }
    .footer {
      font-size: 12px;
      color: #aaa;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 Secure Verification</h1>
    </div>
    <h2>Hello, ${data.name} 👋</h2>
    <p>Your One-Time Password (OTP) is:</p>
    <div class="otp">${data.otp}</div>
    <p>Please use this OTP to complete your action. It will expire shortly for your security 🔒</p>
    <p class="footer">If you didn't request this, ignore this email.</p>
  </div>
</body>
</html>
  `;
};
