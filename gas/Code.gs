/**
 * BIOBUSINESS SCIENTIFIC - GOOGLE APPS SCRIPT BACKEND
 * Production-ready serverless backend powering Google Sheets & Email Notifications.
 * 
 * Target Spreadsheet:
 * Sheet 1: "Quote Requests"
 * Sheet 2: "Contact Messages"
 * Sheet 3: "Invoices"
 * Sheet 4: "Invoice Items"
 */

// If your Apps Script was created as a standalone project (script.google.com),
// paste your target Google Sheet ID here (from https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit)
// Example: const SPREADSHEET_ID = "1ABC123xyz...";
const SPREADSHEET_ID = ""; // Leave blank if script is bound directly inside Google Sheet via Extensions > Apps Script

const ADMIN_EMAIL = "sales@biobusiness.in";
const COMPANY_NAME = "Biobusiness Development Agency";
const WEBSITE_URL = "https://www.biobusiness.in";

/**
 * Get active Google Spreadsheet or open target sheet by SPREADSHEET_ID
 */
function getSpreadsheet() {
  if (typeof SPREADSHEET_ID === "string" && SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } catch (e) {
      Logger.log("Error opening spreadsheet by ID: " + e.toString());
    }
  }

  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  try {
    const activeObj = SpreadsheetApp.getActive();
    if (activeObj) return activeObj;
  } catch (e) {}

  throw new Error("No target Google Sheet bound. If using standalone Apps Script, please paste your Google Sheet ID into SPREADSHEET_ID at top of Code.gs.");
}

/**
 * Handle HTTP GET requests from the React Website Frontend.
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action.toString().toLowerCase() : "";
    if (action === "get_next_invoice_number") {
      return getNextInvoiceNumber();
    } else if (action === "get_invoices") {
      return getInvoices();
    } else if (action === "get_invoice") {
      const target = e && e.parameter ? (e.parameter.invoiceId || e.parameter.invoiceNumber) : "";
      return getInvoiceById(target);
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
    const action = sanitizeInput(data.action || "").toLowerCase();

    // Handle invoice actions first
    if (action === "save_invoice" || action === "create_invoice" || action === "update_invoice" || data.formType === "invoice") {
      return saveInvoice(data);
    } else if (action === "get_next_invoice_number") {
      return getNextInvoiceNumber();
    } else if (action === "get_invoices") {
      return getInvoices();
    } else if (action === "get_invoice") {
      return getInvoiceById(data.invoiceId || data.invoiceNumber);
    } else if (action === "delete_invoice") {
      return deleteInvoice(data);
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

  const ss = getSpreadsheet();
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

  const ss = getSpreadsheet();
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
function cleanText(val) {
  if (val === null || val === undefined) return "";
  return val.toString().trim();
}

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
    const ss = getSpreadsheet();
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
 * Supports Upserting (updating existing invoice if number matches, else creating new)
 * Stores full JSON payload in Column 13 ("RawData") for seamless multi-device sync
 */
function saveInvoice(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    let customer = data.customer || {};
    if (typeof customer === "string") {
      try { customer = JSON.parse(customer); } catch(e) { customer = {}; }
    }
    let items = data.items || [];
    if (typeof items === "string") {
      try { items = JSON.parse(items); } catch(e) { items = []; }
    }

    const custTitle = cleanText(customer.title);
    const custInstitution = cleanText(customer.institution);
    const custName = custTitle || custInstitution || cleanText(data.institution) || "Customer";

    if (!custName) {
      return jsonResponse({ success: false, error: "Customer / Institution name is required." });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ success: false, error: "At least one product item is required." });
    }

    const ss = getSpreadsheet();

    // 1. Prepare "Invoices" Sheet (Exact GST Tax Register Format + RawData column 13)
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
        "Invoice Value",
        "RawData"
      ]);
      invoicesSheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#23324D").setFontColor("#FFFFFF");
    } else {
      if (invoicesSheet.getLastColumn() < 13) {
        invoicesSheet.getRange(1, 13).setValue("RawData").setFontWeight("bold").setBackground("#23324D").setFontColor("#FFFFFF");
      }
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
    let invoiceNumber = cleanText(data.invoiceNumber);
    if (!invoiceNumber || invoiceNumber === "AUTO" || invoiceNumber === "") {
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
      data.invoiceNumber = invoiceNumber;
    }

    const timestamp = new Date();
    var rawDateStr = cleanText(data.invoiceDate);
    var invoiceDate = rawDateStr;
    var ymdMatch = rawDateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
      var y = ymdMatch[1];
      var m = ymdMatch[2].length === 1 ? "0" + ymdMatch[2] : ymdMatch[2];
      var d = ymdMatch[3].length === 1 ? "0" + ymdMatch[3] : ymdMatch[3];
      invoiceDate = d + "/" + m + "/" + y;
    }

    const custState = cleanText(customer.state);
    const custGstin = cleanText(customer.gstin) || "N/A";

    // Financial Calculations with per-item GST rates
    let subtotal = 0;
    let taxAmount = 0;
    const ratesSet = [];

    items.forEach(function(item) {
      const price = parseFloat(item.unitPrice) || 0;
      const qty = parseFloat(item.quantity) || 0;
      const itemTaxable = price * qty;
      subtotal += itemTaxable;

      const itemRate = (item.gstRate !== undefined && item.gstRate !== null) ? parseFloat(item.gstRate) : (parseFloat(data.taxRate) || 18);
      if (ratesSet.indexOf(itemRate) === -1) {
        ratesSet.push(itemRate);
      }
      taxAmount += (itemTaxable * itemRate) / 100;
    });

    const taxType = cleanText(data.taxType) || "IGST";
    const exactTotal = subtotal + taxAmount;
    const finalAmount = Math.round(exactTotal);

    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (taxType === "IGST") {
      igst = taxAmount;
    } else if (taxType === "CGST_SGST") {
      cgst = taxAmount / 2;
      sgst = taxAmount / 2;
    }

    const hsnList = items.map(function(i) { return cleanText(i.hsnCode); }).filter(Boolean);
    const primaryHsn = hsnList.length > 0 ? hsnList.join(", ") : "";
    const rateString = ratesSet.length > 0 ? ratesSet.map(function(r) { return r + "%"; }).join(", ") : ((data.taxRate || 18) + "%");
    const custFullName = (custInstitution && custTitle && custInstitution !== custTitle) ? (custInstitution + " (" + custTitle + ")") : custName;
    const pos = custState || "Delhi";

    const rawDataString = JSON.stringify(data);

    const rowData = [
      invoiceDate,
      invoiceNumber,
      custFullName,
      custGstin,
      primaryHsn,
      pos,
      subtotal.toFixed(2),
      rateString,
      igst.toFixed(2),
      cgst.toFixed(2),
      sgst.toFixed(2),
      finalAmount.toFixed(2),
      rawDataString
    ];

    // Check if invoice row already exists for update
    let existingRowIndex = -1;
    const lastRow = invoicesSheet.getLastRow();
    if (lastRow > 1) {
      const existingVals = invoicesSheet.getRange(2, 2, lastRow - 1, 1).getValues();
      for (let i = 0; i < existingVals.length; i++) {
        if (existingVals[i][0] && existingVals[i][0].toString().trim() === invoiceNumber.trim()) {
          existingRowIndex = i + 2;
          break;
        }
      }
    }

    if (existingRowIndex > 1) {
      // Update existing row
      invoicesSheet.getRange(existingRowIndex, 1, 1, 13).setValues([rowData]);

      // Remove existing item rows in Invoice Items for this invoice
      if (itemsSheet.getLastRow() > 1) {
        const itemVals = itemsSheet.getRange(2, 2, itemsSheet.getLastRow() - 1, 1).getValues();
        for (let j = itemVals.length - 1; j >= 0; j--) {
          if (itemVals[j][0] && itemVals[j][0].toString().trim() === invoiceNumber.trim()) {
            itemsSheet.deleteRow(j + 2);
          }
        }
      }
    } else {
      // Append new row
      invoicesSheet.appendRow(rowData);
    }

    // Write Individual Invoice Items Rows
    items.forEach(function(item) {
      const code = cleanText(item.code);
      const desc = cleanText(item.description);
      const hsn = cleanText(item.hsnCode);
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

/**
 * Fetch All Saved Invoices from Google Sheets
 */
function getInvoices() {
  try {
    const ss = getSpreadsheet();
    const invoicesSheet = ss.getSheetByName("Invoices");
    if (!invoicesSheet) {
      return jsonResponse({ success: true, invoices: [] });
    }

    const lastRow = invoicesSheet.getLastRow();
    if (lastRow <= 1) {
      return jsonResponse({ success: true, invoices: [] });
    }

    // Get all invoices summary data
    const maxCols = invoicesSheet.getLastColumn();
    if (maxCols < 1) {
      return jsonResponse({ success: true, invoices: [] });
    }
    const values = invoicesSheet.getRange(2, 1, lastRow - 1, maxCols).getValues();

    // Get items sheet data if available
    const itemsSheet = ss.getSheetByName("Invoice Items");
    let itemsMap = {};
    if (itemsSheet && itemsSheet.getLastRow() > 1) {
      const itemValues = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 8).getValues();
      itemValues.forEach(function(row) {
        const invNum = row[1] ? row[1].toString().trim() : "";
        if (invNum) {
          if (!itemsMap[invNum]) itemsMap[invNum] = [];
          itemsMap[invNum].push({
            id: 'item-' + Math.random().toString(36).substr(2, 9),
            code: row[2] ? row[2].toString() : "",
            description: row[3] ? row[3].toString() : "",
            hsnCode: row[4] ? row[4].toString() : "",
            unitPrice: parseFloat(row[5]) || 0,
            quantity: parseFloat(row[6]) || 0,
            totalPrice: parseFloat(row[7]) || 0
          });
        }
      });
    }

    const records = [];
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const invDate = row[0] ? row[0].toString() : "";
      const invNumber = row[1] ? row[1].toString().trim() : "";
      const custFullName = row[2] ? row[2].toString() : "";
      const gstin = row[3] ? row[3].toString() : "N/A";
      const hsn = row[4] ? row[4].toString() : "";
      const pos = row[5] ? row[5].toString() : "";
      const taxableVal = parseFloat(row[6]) || 0;
      const rateStr = row[7] ? row[7].toString() : "18%";
      const igst = parseFloat(row[8]) || 0;
      const cgst = parseFloat(row[9]) || 0;
      const sgst = parseFloat(row[10]) || 0;
      const invoiceVal = parseFloat(row[11]) || 0;

      if (!invNumber) continue;

      let invoiceDataObj = null;

      // Check Column 13 (RawData - 0-indexed index 12)
      if (row.length >= 13 && row[12]) {
        try {
          const rawText = row[12].toString();
          if (rawText && rawText.trim().startsWith("{")) {
            invoiceDataObj = JSON.parse(rawText);
          }
        } catch (e) {
          Logger.log("Failed to parse RawData JSON for " + invNumber + ": " + e.toString());
        }
      }

      // If no RawData object stored, construct fallback InvoiceData object
      if (!invoiceDataObj) {
        const taxRate = parseFloat(rateStr.replace("%", "")) || 18;
        const taxType = (igst > 0) ? "IGST" : "CGST_SGST";
        const items = itemsMap[invNumber] || [];

        invoiceDataObj = {
          invoiceNumber: invNumber,
          invoiceDate: invDate,
          orderNumber: "N/A",
          orderDate: "",
          customer: {
            title: custFullName,
            institution: custFullName,
            addressLine1: pos,
            addressLine2: "",
            cityStatePin: pos,
            state: pos,
            gstin: gstin,
            phone: "",
            email: ""
          },
          items: items,
          taxType: taxType,
          taxRate: taxRate,
          discountAmount: 0,
          paymentTerms: "Payment, within 20 days from the date of submission of the invoice, through bankers cheque or demand draft or RTGS is acceptable to us",
          jurisdiction: "Delhi",
          paymentNote: "If the Invoice not paid within the due date, an interest @18% PA will be charged from the date of invoice",
          signatoryName: "For BIOBUSINESS DEVELOPMENT AGENCY",
          companyName: "For BIOBUSINESS DEVELOPMENT AGENCY",
          contactNumber: "9899571171 / 9312217643"
        };
      }

      records.push({
        id: "inv-" + invNumber.replace(/[^a-zA-Z0-9]/g, "-"),
        invoiceNumber: invNumber,
        customerName: custFullName,
        institution: custFullName,
        date: invDate,
        totalAmount: invoiceVal || taxableVal,
        savedAt: new Date().toISOString(),
        data: invoiceDataObj,
        syncedToGoogleSheets: true
      });
    }

    // Sort newest invoices first
    records.reverse();

    return jsonResponse({ success: true, invoices: records });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}

/**
 * Delete Invoice from Google Sheets
 */
function deleteInvoice(data) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    const invoiceNumber = sanitizeInput(data.invoiceNumber || "");
    if (!invoiceNumber) {
      return jsonResponse({ success: false, error: "Invoice number is required for deletion." });
    }

    const ss = getSpreadsheet();

    // 1. Delete from Invoices Sheet
    const invoicesSheet = ss.getSheetByName("Invoices");
    if (invoicesSheet && invoicesSheet.getLastRow() > 1) {
      const values = invoicesSheet.getRange(2, 2, invoicesSheet.getLastRow() - 1, 1).getValues();
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i][0] && values[i][0].toString().trim() === invoiceNumber.trim()) {
          invoicesSheet.deleteRow(i + 2);
        }
      }
    }

    // 2. Delete from Invoice Items Sheet
    const itemsSheet = ss.getSheetByName("Invoice Items");
    if (itemsSheet && itemsSheet.getLastRow() > 1) {
      const itemValues = itemsSheet.getRange(2, 2, itemsSheet.getLastRow() - 1, 1).getValues();
      for (let j = itemValues.length - 1; j >= 0; j--) {
        if (itemValues[j][0] && itemValues[j][0].toString().trim() === invoiceNumber.trim()) {
          itemsSheet.deleteRow(j + 2);
        }
      }
    }

    return jsonResponse({
      success: true,
      message: "Invoice " + invoiceNumber + " deleted successfully from Google Sheets."
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

/**
 * Fetch a single invoice record by invoiceId or invoiceNumber directly from Google Sheets
 */
function getInvoiceById(targetIdOrNum) {
  try {
    const searchVal = cleanText(targetIdOrNum);
    if (!searchVal) {
      return jsonResponse({ success: false, error: "invoiceId or invoiceNumber parameter is required." });
    }

    const allRes = getInvoices();
    const resObj = JSON.parse(allRes.getContent());
    if (resObj && resObj.success && Array.isArray(resObj.invoices)) {
      const found = resObj.invoices.find(function(rec) {
        return (rec.id && rec.id.toLowerCase() === searchVal.toLowerCase()) ||
               (rec.invoiceNumber && rec.invoiceNumber.toLowerCase() === searchVal.toLowerCase());
      });
      if (found) {
        return jsonResponse({ success: true, invoice: found.data, record: found });
      }
    }

    return jsonResponse({ success: false, error: "Invoice " + searchVal + " not found." });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  }
}
