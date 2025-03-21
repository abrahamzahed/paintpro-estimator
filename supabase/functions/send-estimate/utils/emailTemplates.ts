
// Helper function to generate email HTML
export function generateEstimateEmailHtml(estimateData: any, contactInfo: any): string {
  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(estimateData.total);

  // Helper function to format options as "Yes" or "No"
  const formatOption = (value: boolean) => value ? 'Yes' : 'No';
  
  // Helper function to format discount options
  const formatDiscountOption = (value: boolean, discountText: string) => 
    value ? `Yes (${discountText})` : 'No';

  // Generate detailed room cards
  const roomDetailCards = estimateData.rooms
    .map((room: any, index: number) => {
      // Generate price breakdown HTML
      const priceBreakdownHtml = Object.entries(room.priceDetails)
        .filter(([_, value]) => Number(value) !== 0) // Filter out zero values
        .map(([key, value]) => {
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
          
          const isDiscount = Number(value) < 0;
          const valueFormatted = isDiscount 
            ? `<span style="color: #10b981;">-$${Math.abs(Number(value)).toFixed(2)}</span>`
            : `+$${Number(value).toFixed(2)}`;
            
          return `
            <tr>
              <td style="padding: 5px; text-align: left;">${formattedKey}:</td>
              <td style="padding: 5px; text-align: right;">${valueFormatted}</td>
            </tr>
          `;
        })
        .join('');

      return `
        <div style="margin-bottom: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 18px;">${room.name} (Room ${index + 1})</h3>
            <span style="font-weight: bold; font-size: 18px;">$${room.price.toFixed(2)}</span>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Size:</p>
              <p style="margin: 5px 0;">${room.size.size}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Paint Type:</p>
              <p style="margin: 5px 0;">${room.paintType.name}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Ceiling:</p>
              <p style="margin: 5px 0;">${room.options.highCeiling ? 'High ceiling' : 'Standard'}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Wall Colors:</p>
              <p style="margin: 5px 0;">${room.options.twoColors ? 'Two colors' : 'Single color'}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Closets:</p>
              <p style="margin: 5px 0;">${room.closets.walkInCount} walk-in, ${room.closets.regularCount} regular</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Doors:</p>
              <p style="margin: 5px 0;">${room.doors.count} doors</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Windows:</p>
              <p style="margin: 5px 0;">${room.windows.count} windows</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Fireplace:</p>
              <p style="margin: 5px 0;">${room.fireplace}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Repairs:</p>
              <p style="margin: 5px 0;">${room.repairs}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Stair Railing:</p>
              <p style="margin: 5px 0;">${formatOption(room.options.stairRailing)}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Baseboards:</p>
              <p style="margin: 5px 0;">${room.baseboardType}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Baseboard Installation:</p>
              <p style="margin: 5px 0;">${room.baseboardInstallationFeet > 0 ? `${room.baseboardInstallationFeet} linear feet` : 'None'}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Millwork Priming:</p>
              <p style="margin: 5px 0;">${formatOption(room.options.millworkPriming)}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Empty Room:</p>
              <p style="margin: 5px 0;">${formatDiscountOption(room.options.emptyRoom, 'Discounted')}</p>
            </div>
            
            <div>
              <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">No Floor Covering:</p>
              <p style="margin: 5px 0;">${formatDiscountOption(room.options.noFloorCovering, 'Discounted')}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
            <h4 style="margin: 0 0 10px 0; font-size: 16px;">Price Breakdown:</h4>
            <table style="width: 100%; font-size: 14px;">
              <tbody>
                ${priceBreakdownHtml}
              </tbody>
            </table>
          </div>
        </div>
      `;
    })
    .join('');

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
          h2 { color: #1f2937; margin-top: 30px; }
          h3 { color: #1f2937; }
          .project-details { margin-bottom: 30px; }
          .project-details dt { font-weight: bold; margin-top: 10px; }
          .project-details dd { margin-left: 0; margin-bottom: 5px; }
          .total-section { margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
          .grand-total { font-size: 18px; font-weight: bold; color: #1f2937; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Paint Pro Estimate</h1>
            <p>Thank you for using our estimation service!</p>
          </div>
          
          <div class="project-details">
            <h2>Project Details</h2>
            <dl>
              <dt>Project Name:</dt>
              <dd>${contactInfo.projectName || "New Project"}</dd>
              
              <dt>Client:</dt>
              <dd>${contactInfo.fullName}</dd>
              
              <dt>Email:</dt>
              <dd>${contactInfo.email}</dd>
              
              <dt>Phone:</dt>
              <dd>${contactInfo.phone}</dd>
              
              <dt>Address:</dt>
              <dd>${contactInfo.address}</dd>
              
              <dt>Date:</dt>
              <dd>${new Date().toLocaleDateString()}</dd>
            </dl>
          </div>
          
          <div>
            <h2>Rooms Breakdown</h2>
            <div>
              ${roomDetailCards}
            </div>
          </div>
          
          <div class="total-section">
            <p><strong>Subtotal:</strong> $${estimateData.subtotal.toFixed(2)}</p>
            <p><strong>Volume Discount:</strong> $${estimateData.volumeDiscount.toFixed(2)}</p>
            <p class="grand-total">Total Estimate: ${totalFormatted}</p>
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
