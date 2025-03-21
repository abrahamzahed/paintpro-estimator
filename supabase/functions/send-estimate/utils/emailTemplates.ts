
// Helper functions for generating email content

/**
 * Format options as "Yes" or "No"
 */
const formatOption = (value: boolean): string => value ? 'Yes' : 'No';

/**
 * Format discount options showing additional text when enabled
 */
const formatDiscountOption = (value: boolean, discountText: string): string => 
  value ? `Yes (${discountText})` : 'No';

/**
 * Generate HTML for project details section
 */
function generateProjectDetailsHtml(contactInfo: any): string {
  return `
    <div style="margin-bottom: 30px;">
      <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Project Details</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 12px; width: 25%; font-weight: bold; color: #4b5563;">Project Name:</td>
          <td style="padding: 8px 12px; width: 25%;">${contactInfo.projectName || "New Project"}</td>
          <td style="padding: 8px 12px; width: 25%; font-weight: bold; color: #4b5563;">Date:</td>
          <td style="padding: 8px 12px; width: 25%;">${new Date().toLocaleDateString()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; color: #4b5563;">Client:</td>
          <td style="padding: 8px 12px;">${contactInfo.fullName}</td>
          <td style="padding: 8px 12px; font-weight: bold; color: #4b5563;">Phone:</td>
          <td style="padding: 8px 12px;">${contactInfo.phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; color: #4b5563;">Email:</td>
          <td style="padding: 8px 12px;">${contactInfo.email}</td>
          <td style="padding: 8px 12px; font-weight: bold; color: #4b5563;">Address:</td>
          <td style="padding: 8px 12px;">${contactInfo.address}</td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Generate HTML for price breakdown table
 */
function generatePriceBreakdownHtml(priceDetails: Record<string, any>): string {
  return Object.entries(priceDetails)
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
          <td style="padding: 5px; text-align: left; color: #4b5563;">${formattedKey}:</td>
          <td style="padding: 5px; text-align: right; font-weight: bold;">${valueFormatted}</td>
        </tr>
      `;
    })
    .join('');
}

/**
 * Generate HTML for room details in a two-column layout
 */
function generateRoomDetailsHtml(room: any): string {
  return `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
      <tr>
        <td style="width: 25%; padding: 6px 8px; color: #4b5563;">Size:</td>
        <td style="width: 25%; padding: 6px 8px;">${room.size.size}</td>
        <td style="width: 25%; padding: 6px 8px; color: #4b5563;">Paint Type:</td>
        <td style="width: 25%; padding: 6px 8px;">${room.paintType.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Ceiling:</td>
        <td style="padding: 6px 8px;">${room.options.highCeiling ? 'High ceiling' : 'Standard'}</td>
        <td style="padding: 6px 8px; color: #4b5563;">Wall Colors:</td>
        <td style="padding: 6px 8px;">${room.options.twoColors ? 'Two colors' : 'Single color'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Closets:</td>
        <td style="padding: 6px 8px;">${room.closets.walkInCount} walk-in, ${room.closets.regularCount} regular</td>
        <td style="padding: 6px 8px; color: #4b5563;">Doors:</td>
        <td style="padding: 6px 8px;">${room.doors.count} doors</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Windows:</td>
        <td style="padding: 6px 8px;">${room.windows.count} windows</td>
        <td style="padding: 6px 8px; color: #4b5563;">Fireplace:</td>
        <td style="padding: 6px 8px;">${room.fireplace}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Repairs:</td>
        <td style="padding: 6px 8px;">${room.repairs}</td>
        <td style="padding: 6px 8px; color: #4b5563;">Stair Railing:</td>
        <td style="padding: 6px 8px;">${room.options.stairRailing ? 'Included' : 'Not included'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Baseboards:</td>
        <td style="padding: 6px 8px;">${room.baseboardType}</td>
        <td style="padding: 6px 8px; color: #4b5563;">Baseboard Installation:</td>
        <td style="padding: 6px 8px;">${room.baseboardInstallationFeet > 0 ? `${room.baseboardInstallationFeet} linear feet` : 'None'}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">Millwork Priming:</td>
        <td style="padding: 6px 8px;">${room.options.millworkPriming ? 'Included' : 'Not needed'}</td>
        <td style="padding: 6px 8px; color: #4b5563;">Empty Room:</td>
        <td style="padding: 6px 8px;">${formatDiscountOption(room.options.emptyRoom, 'Discounted')}</td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; color: #4b5563;">No Floor Covering:</td>
        <td style="padding: 6px 8px;">${formatDiscountOption(room.options.noFloorCovering, 'Discounted')}</td>
        <td style="padding: 6px 8px;"></td>
        <td style="padding: 6px 8px;"></td>
      </tr>
    </table>
  `;
}

/**
 * Generate HTML for a single room card
 */
function generateRoomCardHtml(room: any, index: number): string {
  const priceBreakdownHtml = generatePriceBreakdownHtml(room.priceDetails);
  const roomDetailsHtml = generateRoomDetailsHtml(room);

  return `
    <div style="margin-bottom: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
        <h3 style="margin: 0; font-size: 18px; color: #1f2937;">${room.name} (Room ${index + 1})</h3>
        <span style="font-weight: bold; font-size: 18px; color: #1f2937;">$${room.price.toFixed(2)}</span>
      </div>
      
      ${roomDetailsHtml}
      
      <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
        <h4 style="margin: 0 0 10px 0; font-size: 16px; color: #1f2937;">Price Breakdown:</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tbody>
            ${priceBreakdownHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/**
 * Generate HTML for all room cards
 */
function generateAllRoomCardsHtml(rooms: any[]): string {
  return rooms
    .map((room, index) => generateRoomCardHtml(room, index))
    .join('');
}

/**
 * Generate HTML for total estimate section
 */
function generateTotalSectionHtml(estimateData: any): string {
  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(estimateData.total);

  return `
    <div style="margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; text-align: right; width: 80%; font-weight: bold; color: #4b5563;">Subtotal:</td>
          <td style="padding: 8px; text-align: right; width: 20%;">$${estimateData.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; text-align: right; font-weight: bold; color: #4b5563;">Volume Discount:</td>
          <td style="padding: 8px; text-align: right; color: #10b981;">-$${Math.abs(estimateData.volumeDiscount).toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 15px 8px; text-align: right; font-weight: bold; font-size: 18px; color: #1f2937; border-top: 1px solid #e5e7eb;">Total Estimate:</td>
          <td style="padding: 15px 8px; text-align: right; font-weight: bold; font-size: 18px; color: #1f2937; border-top: 1px solid #e5e7eb;">${totalFormatted}</td>
        </tr>
      </table>
    </div>
  `;
}

/**
 * Generate CSS styles for email
 */
function generateEmailStyles(): string {
  return `
    <style>
      body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0;
        padding: 0;
      }
      .container { 
        max-width: 650px; 
        margin: 0 auto; 
        padding: 20px; 
      }
      .header { 
        text-align: center; 
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e5e7eb;
      }
      h1 { 
        color: #2563eb; 
        margin-top: 0;
      }
      h2 { 
        color: #1f2937; 
        margin-top: 30px; 
      }
      h3 { 
        color: #1f2937; 
      }
      .footer { 
        margin-top: 40px; 
        padding-top: 20px; 
        border-top: 1px solid #e5e7eb; 
        font-size: 14px; 
        color: #6b7280; 
        text-align: center; 
      }
    </style>
  `;
}

/**
 * Main function to generate the complete email HTML
 */
export function generateEstimateEmailHtml(estimateData: any, contactInfo: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Paint Pro Estimate</title>
        ${generateEmailStyles()}
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Paint Pro Estimate</h1>
            <p>Thank you for using our estimation service!</p>
          </div>
          
          ${generateProjectDetailsHtml(contactInfo)}
          
          <div>
            <h2 style="color: #1f2937; font-size: 20px; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
              Rooms Breakdown
            </h2>
            <div>
              ${generateAllRoomCardsHtml(estimateData.rooms)}
            </div>
          </div>
          
          ${generateTotalSectionHtml(estimateData)}
          
          <div class="footer">
            <p>This estimate is valid for 30 days. If you have any questions, please contact us.</p>
            <p>Paint Pro Services - Making your space beautiful since 2023</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
