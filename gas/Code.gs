/**
 * BIOBUSINESS SCIENTIFIC - GOOGLE APPS SCRIPT BACKEND
 * Production-ready serverless backend powering Google Sheets & Email Notifications.
 * 
 * Target Spreadsheet:
 * Sheet 1: "Quote Requests"
 * Sheet 2: "Contact Messages"
 */

const ADMIN_EMAIL = "sales@biobusiness.in";
const COMPANY_NAME = "Biobusiness Development Agency";
const WEBSITE_URL = "https://www.biobusiness.in";

/**
 * Handle HTTP GET requests from the React Website Frontend.
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : "";
    if (action === "get_next_invoice_number") {
      return getNextInvoiceNumber();
    }
    return jsonResponse({ success: true, message: "BioBusiness Apps Script API Operational" });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle HTTP POST requests from the React Website Frontend.
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ success: false, error: "Empty request payload" });
    }

    const data = JSON.parse(e.postData.contents);
    const action = sanitizeInput(data.action || "");

    // Handle invoice actions first
    if (action === "save_invoice" || data.formType === "invoice") {
      return saveInvoice(data);
    } else if (action === "get_next_invoice_number") {
      return getNextInvoiceNumber();
    }

    // 30-Second Rate Limiting Check to prevent duplicate spam for contact/quote forms
    const userEmail = sanitizeInput(data.email || "");
    if (userEmail && isRateLimited(userEmail)) {
      return jsonResponse({
        success: false,
        error: "A submission from this email was received recently. Please wait 30 seconds before submitting again."
      });
    }

    if (action === "quote" || data.formType === "quote" || data.institution) {
      return submitQuote(data);
    } else if (action === "contact" || data.formType === "contact" || data.message) {
      return submitContact(data);
    } else {
      return jsonResponse({ success: false, error: "Invalid form submission type" });
    }
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Handle Quote Request Submissions
 */
function submitQuote(data) {
  const institution = sanitizeInput(data.institution || "");
  const email = sanitizeInput(data.email || "");
  const phone = sanitizeInput(data.phone || "");
  const gstin = sanitizeInput(data.gstin || "N/A");
  const tenderRef = sanitizeInput(data.tenderRef || data.tenderReference || "N/A");
  const notes = sanitizeInput(data.notes || data.additionalRequirements || "None");
  const productsList = data.items || data.products || [];

  // Validation
  if (!institution || !email || !phone) {
    return jsonResponse({ success: false, error: "Please fill in all required fields (Institution, Email, Phone)." });
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, error: "Please provide a valid official email address." });
  }
  if (!productsList || productsList.length === 0) {
    return jsonResponse({ success: false, error: "Your quote basket is empty. Please add products to submit a request." });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Quote Requests");
  if (!sheet) {
    sheet = ss.insertSheet("Quote Requests");
    sheet.appendRow([
      "Timestamp", "Reference ID", "Institution", "Official Email",
      "Phone", "GSTIN", "Tender Reference", "Products",
      "Total Items", "Additional Requirements", "Status", "Source"
    ]);
    sheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#6EA8FE").setFontColor("#FFFFFF");
  }

  const refId = generateReference("BBQ", sheet);
  const formattedProducts = buildProductList(productsList);
  const totalQuantity = productsList.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const timestamp = new Date();

  // Append Row
  sheet.appendRow([
    timestamp,
    refId,
    institution,
    email,
    phone,
    gstin,
    tenderRef,
    formattedProducts,
    totalQuantity,
    notes,
    "New",
    "Website"
  ]);

  // Set rate limiting cache
  setRateLimit(email);

  // Send Emails
  sendAdminQuoteNotification(refId, timestamp, institution, email, phone, gstin, tenderRef, formattedProducts, totalQuantity, notes);
  sendCustomerConfirmation(email, institution, refId);

  return jsonResponse({
    success: true,
    referenceId: refId,
    message: "Your institutional quote request has been submitted successfully."
  });
}

/**
 * Handle Contact Message Submissions
 */
function submitContact(data) {
  const name = sanitizeInput(data.name || "");
  const email = sanitizeInput(data.email || "");
  const phone = sanitizeInput(data.phone || "N/A");
  const subject = sanitizeInput(data.subject || "General Inquiry");
  const message = sanitizeInput(data.message || "");

  // Validation
  if (!name || !email || !message) {
    return jsonResponse({ success: false, error: "Please fill in all required fields (Name, Email, Message)." });
  }
  if (!isValidEmail(email)) {
    return jsonResponse({ success: false, error: "Please provide a valid email address." });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Contact Messages");
  if (!sheet) {
    sheet = ss.insertSheet("Contact Messages");
    sheet.appendRow([
      "Timestamp", "Reference ID", "Name", "Email",
      "Phone", "Subject", "Message", "Status", "Source"
    ]);
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#6EA8FE").setFontColor("#FFFFFF");
  }

  const refId = generateReference("BBC", sheet);
  const timestamp = new Date();

  // Append Row
  sheet.appendRow([
    timestamp,
    refId,
    name,
    email,
    phone,
    subject,
    message,
    "New",
    "Website"
  ]);

  // Set rate limiting cache
  setRateLimit(email);

  // Send Emails
  sendAdminContactNotification(refId, timestamp, name, email, phone, subject, message);
  sendCustomerConfirmation(email, name, refId);

  return jsonResponse({
    success: true,
    referenceId: refId,
    message: "Your message has been received successfully."
  });
}

/**
 * Auto-Increment Reference ID Generator (BBQ-2026-0001 or BBC-2026-0001)
 */
function generateReference(prefix, sheet) {
  const year = new Date().getFullYear();
  const lastRow = sheet.getLastRow();
  let nextSeq = 1;

  if (lastRow > 1) {
    const lastRef = sheet.getRange(lastRow, 2).getValue().toString();
    const parts = lastRef.split("-");
    if (parts.length === 3 && !isNaN(parts[2])) {
      nextSeq = parseInt(parts[2], 10) + 1;
    } else {
      nextSeq = lastRow;
    }
  }

  const padSeq = ("0000" + nextSeq).slice(-4);
  return `${prefix}-${year}-${padSeq}`;
}

/**
 * Convert product basket array into readable text string
 */
function buildProductList(items) {
  if (!items || !Array.isArray(items)) return "None";

  return items.map((item, idx) => {
    const p = item.product || item;
    const name = p.name || p.title || "Scientific Item";
    const sku = p.sku || p.model || "N/A";
    const qty = item.quantity || 1;
    return `${idx + 1}. ${name}\n   SKU: ${sku}\n   Quantity: ${qty}`;
  }).join("\n\n");
}

/**
 * Admin Quote Email Notification
 */
function sendAdminQuoteNotification(refId, timestamp, institution, email, phone, gstin, tenderRef, formattedProducts, totalQty, notes) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFBFD; padding: 24px; border-radius: 16px; border: 1px solid #E6ECF5;">
      <div style="background: #23324D; color: #FFFFFF; padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">BIOBUSINESS DEVELOPMENT AGENCY</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #6EA8FE;">New Institutional Quote Request • ${refId}</p>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 20px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <h3 style="margin-top: 0; color: #23324D; border-bottom: 2px solid #E6ECF5; padding-bottom: 8px;">Institutional Details</h3>
        <p><strong>Reference ID:</strong> <span style="font-family: monospace; color: #6EA8FE; font-weight: bold;">${refId}</span></p>
        <p><strong>Institution:</strong> ${institution}</p>
        <p><strong>Official Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone / WhatsApp:</strong> ${phone}</p>
        <p><strong>GSTIN:</strong> ${gstin}</p>
        <p><strong>Tender Reference:</strong> ${tenderRef}</p>
        <p><strong>Timestamp:</strong> ${timestamp.toLocaleString("en-IN")}</p>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 20px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <h3 style="margin-top: 0; color: #23324D; border-bottom: 2px solid #E6ECF5; padding-bottom: 8px;">Requested Product Basket (${totalQty} Items)</h3>
        <pre style="font-family: 'Courier New', monospace; font-size: 13px; background: #F4F8FC; padding: 15px; border-radius: 8px; border: 1px solid #E6ECF5; white-space: pre-wrap;">${formattedProducts}</pre>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 20px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <h3 style="margin-top: 0; color: #23324D; border-bottom: 2px solid #E6ECF5; padding-bottom: 8px;">Additional Requirements</h3>
        <p style="color: #5F708A;">${notes}</p>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #9AA7BC;">
        Automated Notification System • Biobusiness Development Agency Government Supplier
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Quote Request • ${refId} (${institution})`,
    htmlBody: htmlBody
  });
}

/**
 * Admin Contact Email Notification
 */
function sendAdminContactNotification(refId, timestamp, name, email, phone, subject, message) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFBFD; padding: 24px; border-radius: 16px; border: 1px solid #E6ECF5;">
      <div style="background: #23324D; color: #FFFFFF; padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">BIOBUSINESS DEVELOPMENT AGENCY</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #6EA8FE;">New Contact Message • ${refId}</p>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 20px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <h3 style="margin-top: 0; color: #23324D; border-bottom: 2px solid #E6ECF5; padding-bottom: 8px;">Sender Information</h3>
        <p><strong>Reference ID:</strong> <span style="font-family: monospace; color: #6EA8FE; font-weight: bold;">${refId}</span></p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Timestamp:</strong> ${timestamp.toLocaleString("en-IN")}</p>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 20px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <h3 style="margin-top: 0; color: #23324D; border-bottom: 2px solid #E6ECF5; padding-bottom: 8px;">Message Content</h3>
        <p style="color: #23324D; line-height: 1.6;">${message}</p>
      </div>
    </div>
  `;

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: `New Contact Message • ${refId} (${name})`,
    htmlBody: htmlBody
  });
}

/**
 * Customer Acknowledgement Confirmation Email
 */
function sendCustomerConfirmation(recipientEmail, recipientName, refId) {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAFBFD; padding: 24px; border-radius: 16px; border: 1px solid #E6ECF5;">
      <div style="background: #23324D; color: #FFFFFF; padding: 20px; border-radius: 12px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px; letter-spacing: 1px;">BIOBUSINESS DEVELOPMENT AGENCY</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #7CC9A5;">Enquiry Received</p>
      </div>

      <div style="margin-top: 20px; background: #FFFFFF; padding: 24px; border-radius: 12px; border: 1px solid #E6ECF5;">
        <p style="font-size: 15px; color: #23324D;">Hello <strong>${recipientName}</strong>,</p>
        <p style="color: #5F708A; line-height: 1.6;">
          Thank you for contacting Biobusiness Development Agency. Our contact team will connect with you within 24 hours.
        </p>

        <p style="color: #5F708A; line-height: 1.6;">
          Our team will review your requirements and respond with an official quotation or response shortly.
        </p>
      </div>

      <div style="margin-top: 20px; text-align: center; color: #5F708A; font-size: 12px; line-height: 1.5;">
        <p style="margin: 0; font-weight: bold; color: #23324D;">Biobusiness Development Agency</p>
        <p style="margin: 2px 0;">Government Laboratory Supplier • ISO 9001:2015 Certified</p>
        <p style="margin: 2px 0;"><a href="${WEBSITE_URL}" style="color: #6EA8FE;">www.biobusiness.in</a> • <a href="mailto:${ADMIN_EMAIL}" style="color: #6EA8FE;">${ADMIN_EMAIL}</a></p>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: recipientEmail,
      subject: `We have received your enquiry - Biobusiness Development Agency`,
      htmlBody: htmlBody
    });
  } catch (err) {
    Logger.log("Failed to send customer confirmation email: " + err.toString());
  }
}

/**
 * Utilities & Helper Functions
 */
function sanitizeInput(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isRateLimited(email) {
  const cache = CacheService.getScriptCache();
  const key = "rate_" + email.toLowerCase();
  return cache.get(key) !== null;
}

function setRateLimit(email) {
  const cache = CacheService.getScriptCache();
  const key = "rate_" + email.toLowerCase();
  cache.put(key, "true", 30); // 30 seconds
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Auto-Increment Invoice Number Generator (BDA/172, BDA/173, etc.)
 */
function getNextInvoiceNumber() {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName("Invoices");
    if (!sheet) {
      return jsonResponse({ success: true, nextInvoiceNumber: "BDA/001" });
    }

    const lastRow = sheet.getLastRow();
    let maxSeq = 0;

    if (lastRow > 1) {
      const values = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < values.length; i++) {
        const val = values[i][0] ? values[i][0].toString() : "";
        const match = val.match(/(\d+)\s*$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    }

    const nextNum = maxSeq + 1;
    const padSeq = nextNum < 1000 ? ("000" + nextNum).slice(-3) : nextNum;
    const nextInvoiceNumber = "BDA/" + padSeq;
    return jsonResponse({ success: true, nextInvoiceNumber: nextInvoiceNumber });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * Handle Save Invoice Request (Invoices & Invoice Items sheets)
 */
function saveInvoice(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const customer = data.customer || {};
    const items = data.items || [];

    if (!customer.institution && !customer.title) {
      return jsonResponse({ success: false, error: "Customer / Institution name is required." });
    }
    if (!items || items.length === 0) {
      return jsonResponse({ success: false, error: "At least one product item is required." });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Prepare "Invoices" Sheet (Exact GST Tax Register Format)
    let invoicesSheet = ss.getSheetByName("Invoices");
    if (!invoicesSheet) {
      invoicesSheet = ss.insertSheet("Invoices");
      invoicesSheet.appendRow([
        "Invoice Date",
        "Invoice Number",
        "Customer Name",
        "GST Number",
        "HSN Code",
        "POS",
        "Taxable Value",
        "Rate",
        "IGST",
        "CGST",
        "SGST",
        "Invoice Value"
      ]);
      invoicesSheet.getRange(1, 1, 1, 12).setFontWeight("bold").setBackground("#23324D").setFontColor("#FFFFFF");
    }

    // 2. Prepare "Invoice Items" Sheet
    let itemsSheet = ss.getSheetByName("Invoice Items");
    if (!itemsSheet) {
      itemsSheet = ss.insertSheet("Invoice Items");
      itemsSheet.appendRow([
        "Timestamp", "Invoice Number", "Item Code", "Description", "HSN Code",
        "Unit Price", "Quantity", "Total Price"
      ]);
      itemsSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#23324D").setFontColor("#FFFFFF");
    }

    // Generate Invoice Number if auto-requested or empty
    let invoiceNumber = sanitizeInput(data.invoiceNumber || "");
    if (!invoiceNumber || invoiceNumber === "AUTO" || invoiceNumber.trim() === "") {
      const lastRow = invoicesSheet.getLastRow();
      let maxSeq = 0;
      if (lastRow > 1) {
        const values = invoicesSheet.getRange(2, 2, lastRow - 1, 1).getValues();
        for (let i = 0; i < values.length; i++) {
          const val = values[i][0] ? values[i][0].toString() : "";
          const match = val.match(/(\d+)\s*$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (!isNaN(num) && num > maxSeq) {
              maxSeq = num;
            }
          }
        }
      }
      const nextNum = maxSeq + 1;
      const padSeq = nextNum < 1000 ? ("000" + nextNum).slice(-3) : nextNum;
      invoiceNumber = "BDA/" + padSeq;
    }

    const timestamp = new Date();
    const orderNumber = sanitizeInput(data.orderNumber || "N/A");
    const invoiceDate = sanitizeInput(data.invoiceDate || "");
    const orderDate = sanitizeInput(data.orderDate || "");

    const custTitle = sanitizeInput(customer.title || "");
    const custInstitution = sanitizeInput(customer.institution || "");
    const custAddr1 = sanitizeInput(customer.addressLine1 || "");
    const custAddr2 = sanitizeInput(customer.addressLine2 || "");
    const custCityPin = sanitizeInput(customer.cityStatePin || "");
    const custState = sanitizeInput(customer.state || "");
    const custGstin = sanitizeInput(customer.gstin || "N/A");

    // Financial Calculations
    let subtotal = 0;
    items.forEach(function(item) {
      const price = parseFloat(item.unitPrice) || 0;
      const qty = parseFloat(item.quantity) || 0;
      subtotal += (price * qty);
    });

    const taxType = sanitizeInput(data.taxType || "IGST");
    const taxRate = parseFloat(data.taxRate) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const exactTotal = subtotal + taxAmount;
    const finalAmount = Math.round(exactTotal);
    const roundOff = Math.round((finalAmount - exactTotal) * 100) / 100;

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (taxType === "IGST") {
      igst = taxAmount;
    } else if (taxType === "CGST_SGST") {
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
    }

    const hsnList = items.map(function(i) { return i.hsnCode || ""; }).filter(Boolean);
    const primaryHsn = hsnList.length > 0 ? hsnList.join(", ") : "";
    const custFullName = (custInstitution + (custTitle ? " (" + custTitle + ")" : "")).trim();
    const pos = custState || "Delhi";

    // Write Invoice Summary Row with EXACT 12 Columns Requested:
    // Invoice Date | Invoice Number | Customer Name | GST Number | HSN Code | POS | Taxable Value | Rate | IGST | CGST | SGST | Invoice Value
    invoicesSheet.appendRow([
      invoiceDate,
      invoiceNumber,
      custFullName,
      custGstin,
      primaryHsn,
      pos,
      subtotal.toFixed(2),
      taxRate + "%",
      igst.toFixed(2),
      cgst.toFixed(2),
      sgst.toFixed(2),
      finalAmount.toFixed(2)
    ]);

    // Write Individual Invoice Items Rows
    items.forEach(function(item) {
      const code = sanitizeInput(item.code || "");
      const desc = sanitizeInput(item.description || "");
      const hsn = sanitizeInput(item.hsnCode || "");
      const unitPrice = parseFloat(item.unitPrice) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      const totalPrice = unitPrice * quantity;

      itemsSheet.appendRow([
        timestamp,
        invoiceNumber,
        code,
        desc,
        hsn,
        unitPrice.toFixed(2),
        quantity,
        totalPrice.toFixed(2)
      ]);
    });

    return jsonResponse({
      success: true,
      invoiceNumber: invoiceNumber,
      message: "Invoice " + invoiceNumber + " saved successfully to Google Sheets."
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}
