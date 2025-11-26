export const orderTemplate = ({
  customer_name,
  order_number,
  order_date,
  items = [],
  order_total,
  company_name,
  company_address,
}: {
  customer_name: string;
  order_number: string;
  order_date: string;
  items: any;
  order_total: Number;
  company_name: string;
  company_address: string;
}) => {
  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td>${item.productName}</td>
      <td>${item.quantity}</td>
      <td>${item.price}</td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        background-color: #007bff;
        color: white;
        text-align: center;
        padding: 20px;
      }
      .header img {
        max-width: 120px;
        margin-bottom: 10px;
      }
      .content {
        padding: 20px;
        color: #333333;
      }
      .order-summary {
        margin-top: 20px;
        border-collapse: collapse;
        width: 100%;
      }
      .order-summary th, .order-summary td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
      }
      .order-summary th {
        background-color: #f8f8f8;
      }
      .footer {
        background-color: #f4f4f4;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777777;
      }
      .btn {
        display: inline-block;
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
      }
      @media (max-width: 600px) {
        .email-container {
          width: 100%;
          border-radius: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <!-- Header -->
      <div class="header">
        <h2>Order Confirmation</h2>
      </div>

      <!-- Content -->
      <div class="content">
        <p>Hi <strong>${customer_name}</strong>,</p>
        <p>Thank you for your order! We’ve received your purchase and will send you another email once your items have shipped.</p>

        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${order_number}</p>
        <p><strong>Order Date:</strong> ${order_date}</p>

        <table class="order-summary">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <p><strong>Total:</strong> ${order_total}</p>

        <a href="#" class="btn">View Your Order</a>

        <p>If you have any questions, feel free to reply to this email or contact our support team.</p>
        <p>Thank you for shopping with us!</p>
        <p>– The ${company_name} Team</p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>${company_name} | ${company_address}</p>
      </div>
    </div>
  </body>
</html>
`;
};
