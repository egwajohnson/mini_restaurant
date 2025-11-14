export const confirmationTemplate = (data: {
  name: string;
  ipAddress: string;
  userAgent: string;
}) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          button{
          background-color: blue;
          color: white;
          padding: 10px;
          pointer:cursor;

          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: auto;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Hello, ${data.name}</h2>
          <p>Someone just logged into your account near ${data.ipAddress} on ${data.userAgent}. if this wasn't you , we're here to help you take some steps to secure account</p>
          <button>This wasn't me</button>
        </div>
      </body>
    </html>
        `;
};