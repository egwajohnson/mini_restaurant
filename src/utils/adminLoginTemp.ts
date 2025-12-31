export const adminLoginTemp = (data: {
  name: string;
  userAgent: string;
  ipAddress: string;
}) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Alert</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #2196F3;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
    }
    .button {
      background-color: #2196F3;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Login Alert</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>Your account was just logged into.</p>
       <div class="details">
        <p><strong>IP Address:</strong> ${data.ipAddress}</p>
        <p><strong>Device:</strong> ${data.userAgent}</p>
      </div>
      <p>If this wasn't you, secure your account ASAP.</p>
      <p>
        <a href="#" class="button">Check Activity</a>
      </p>
      <p>Best regards,<br>The Team</p>
    </div>
  </div>
</body>
</html>`;
};
