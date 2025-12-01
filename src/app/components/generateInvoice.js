
import { jsPDF } from 'jspdf';

export const generateInvoice = async (bookingData) => {
  const {
    eventTitle,
    eventDate,
    eventLocation,
    bookingId,
    customerName,
    quantity,
    total,
    seatBooked,
    eventType,
    eventMode,
    image
  } = bookingData;

  const currentDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '20px';
    tempDiv.style.background = 'white';
    tempDiv.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tempDiv.style.fontWeight = 'bold'; 
    
    tempDiv.innerHTML = `
      <div class="invoice-container" style="max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e2e8f0; font-weight: bold;">
        <div class="invoice-header" style="background: #f7fafc; padding: 20px; text-align: center; font-weight: bold;">
          <div class="logo-container" style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px; font-weight: bold;">
            <img 
              src="https://imagedelivery.net/nq9qT5FHZv9Sg48UUnD1-A/0a82b98e-48fe-408a-6f05-a1df7f688d00/public" 
              alt="Rentelligence Logo" 
              style="width: 100%; max-width: 400px; height: auto; object-fit: contain; font-weight: bold;"
              onerror="this.style.display='none'"
            />
          </div>
        </div>
        
        <div class="invoice-body" style="padding: 20px; font-weight: bold;">
          <div class="company-info" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
            <div class="company-details" style="font-weight: bold;">
              <h2 style="color: #2d3748; margin-bottom: 3px; font-size: 1.2rem; font-weight: bold;">Rentelligence</h2>
              <p style="color: #718096; font-size: 0.8rem; font-weight: bold;">Deploying intelligence for financially Independent future</p>
              <p style="color: #718096; font-size: 0.8rem; font-weight: bold;">info@rentelligence.ai</p>
            </div>
            <div class="invoice-meta" style="text-align: right; font-weight: bold;">
              <div class="invoice-number" style="font-size: 1rem; font-weight: bold; color: #2d3748; margin-bottom: 3px;">Invoice: ${bookingId}</div>
              <div class="invoice-date" style="color: #718096; font-size: 0.8rem; font-weight: bold;">Date: ${currentDate}</div>
            </div>
          </div>
          
          <div class="section" style="margin-bottom: 20px; font-weight: bold;">
            <h2 class="section-title" style="font-size: 1.1rem; font-weight: bold; color: #2d3748; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">Event Details</h2>
            <div class="details-card" style="background: #f7fafc; border-radius: 6px; padding: 15px; border-left: 3px solid #667eea; font-weight: bold;">
              <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Event Title</div>
                <div class="info-value" style="color: #2d3748; font-size: 1.1rem; font-weight: bold;">${eventTitle}</div>
              </div>
              
              <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-weight: bold;">
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Event Date & Time</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${eventDate}</div>
                </div>
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Event Location</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${eventLocation}</div>
                </div>
              </div>
              
              <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-weight: bold;">
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Event Type</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${eventType}</div>
                </div>
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Event Mode</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">
                    <span class="" style="display: inline-flex; padding: 3px 8px; font-size: 0.75rem; font-weight: bold; background: transparent; color: #2d3748;">
                      <strong>${eventMode}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section" style="margin-bottom: 20px; font-weight: bold;">
            <h2 class="section-title" style="font-size: 1.1rem; font-weight: bold; color: #2d3748; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">Customer & Booking Information</h2>
            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-weight: bold;">
              <div style="display: flex; flex-direction: column; gap: 10px; font-weight: bold;">
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Customer Name</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${customerName}</div>
                </div>
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Tickets Booked</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${quantity} ticket(s)</div>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px; font-weight: bold;">
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Booking ID</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-family: monospace; font-weight: bold;">${bookingId}</div>
                </div>
                <div class="info-group" style="margin-bottom: 10px; font-weight: bold;">
                  <div class="info-label" style="font-weight: bold; color: #4a5568; font-size: 0.85rem; margin-bottom: 3px;">Seats Reserved</div>
                  <div class="info-value" style="color: #2d3748; font-size: 0.9rem; font-weight: bold;">${seatBooked}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="section" style="margin-bottom: 20px; font-weight: bold;">
            <h2 class="section-title" style="font-size: 1.1rem; font-weight: bold; color: #2d3748; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">Payment Summary</h2>
            <div class="total-section" style="background: #48bb78; color: white; padding: 20px; border-radius: 6px; text-align: center; margin-top: 15px; font-weight: bold;">
              <div class="info-label" style="font-weight: bold; color: rgba(255,255,255,0.9); font-size: 0.85rem; margin-bottom: 3px;">Total Amount Paid</div>
              <div class="total-amount" style="font-size: 1.5rem; font-weight: bold; margin: 8px 0;">$${Number(total).toFixed(2)}</div>
              <div style="opacity: 0.9; margin-top: 8px; font-size: 0.85rem; font-weight: bold;">
                Payment Status: <strong>Completed</strong>
              </div>
            </div>
          </div>
          
          <div class="section" style="margin-bottom: 20px; font-weight: bold;">
            <h2 class="section-title" style="font-size: 1.1rem; font-weight: bold; color: #2d3748; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0;">Terms & Conditions</h2>
            <div style="background: #f7fafc; padding: 12px; border-radius: 6px; font-size: 0.75rem; color: #4a5568; font-weight: bold;">
              <ul style="list-style-position: inside; margin-left: 8px; font-weight: bold;">
                <li style="font-weight: bold;">This invoice is proof of your event booking confirmation</li>
                <li style="font-weight: bold;">Tickets are non-refundable and non-transferable</li>
                <li style="font-weight: bold;">Please carry this invoice and valid ID proof to the event venue</li>
                <li style="font-weight: bold;">For any queries, contact our support team</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer" style="text-align: center; padding: 15px; color: #718096; font-size: 0.8rem; border-top: 1px solid #e2e8f0; margin-top: 20px; font-weight: bold;">
          <p style="font-weight: bold;">Thank you for choosing Rentelligence! We hope you have a wonderful experience.</p>
          <p style="margin-top: 8px; font-weight: bold;">
            For support: info@rentelligence.ai
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(tempDiv);

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use html2canvas to capture the content
    const { default: html2canvas } = await import('html2canvas');
    
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false
    });

    // Clean up
    document.body.removeChild(tempDiv);

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate dimensions to fit the PDF
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;
    
    const ratio = Math.min((pdfWidth - 20) / imgWidth, (pdfHeight - 20) / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`Invoice-${bookingId}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    try {
      const pdf = new jsPDF();
      pdf.setFont(undefined, 'bold');
      pdf.text(`Invoice: ${bookingId}`, 20, 20);
      pdf.text(`Date: ${currentDate}`, 20, 30);
      pdf.text(`Event: ${eventTitle}`, 20, 40);
      pdf.text(`Customer: ${customerName}`, 20, 50);
      pdf.text(`Amount: ₹${Number(total).toFixed(2)}`, 20, 60);
      pdf.save(`Invoice-${bookingId}.pdf`);
    } catch (fallbackError) {
      const invoiceWindow = window.open('', '_blank');
      const fallbackHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${bookingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-weight: bold; }
            .invoice { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; font-weight: bold; }
            .section { margin-bottom: 15px; font-weight: bold; }
            h2, h3, p, strong { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h2>Rentelligence Invoice</h2>
              <p>Invoice: ${bookingId}</p>
              <p>Date: ${currentDate}</p>
            </div>
            <div class="section">
              <h3>Event Details</h3>
              <p><strong>Event:</strong> ${eventTitle}</p>
              <p><strong>Date:</strong> ${eventDate}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
            </div>
            <div class="section">
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> ${customerName}</p>
              <p><strong>Tickets:</strong> ${quantity}</p>
            </div>
            <div class="section">
              <h3>Payment Summary</h3>
              <p><strong>Total Amount:</strong> ₹${Number(total).toFixed(2)}</p>
              <p><strong>Status:</strong> Completed</p>
            </div>
          </div>
          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
        </html>
      `;
      invoiceWindow.document.write(fallbackHTML);
      invoiceWindow.document.close();
    }
  }
};