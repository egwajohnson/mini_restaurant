export const adminTemplate = (data: { name: string }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome, Admin!</title>
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
      background-color: #4CAF50;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      padding: 20px;
    }
    .button {
      background-color: #4CAF50;
      color: #fff;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome, Admin!</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>Congratulations! Your registration was successful.</p>
      <p>You're now part of our team! Get ready to manage and make a difference.</p>
      <p>
        <a href="#" class="button">Get Started</a>
      </p>
      <p>Best regards,<br>The Team</p>
    </div>
  </div>
</body>
</html>`;
};
