
// Helper function to generate email HTML
export function generateEstimateEmailHtml(estimateData: any, contactInfo: any): string {
  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(estimateData.total);

  const roomsList = estimateData.rooms
    .map((room: any) => {
      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.roomType.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${room.size.size}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${room.price.toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your Paint Pro Estimate</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
          .footer { margin-top: 40px; font-size: 14px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Paint Pro Estimate</h1>
            <p>Thank you for using our estimation service!</p>
          </div>
          
          <div>
            <h2>Project Details</h2>
            <p><strong>Project Name:</strong> ${contactInfo.projectName}</p>
            <p><strong>Client:</strong> ${contactInfo.fullName}</p>
            <p><strong>Address:</strong> ${contactInfo.address}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div>
            <h2>Estimate Summary</h2>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Room</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Type</th>
                  <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Size</th>
                  <th style="text-align: right; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${roomsList}
              </tbody>
            </table>
            <div class="total">
              <p>Subtotal: $${estimateData.subtotal.toFixed(2)}</p>
              <p>Discount: $${estimateData.volumeDiscount.toFixed(2)}</p>
              <p>Total Estimate: ${totalFormatted}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>This estimate is valid for 30 days. If you have any questions, please contact us.</p>
            <p>Paint Pro Services - Making your space beautiful since 2023</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
