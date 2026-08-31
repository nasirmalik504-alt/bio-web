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

// ═══════════════════════════════════════════════════════════
// INVOICE FUNCTIONS
// All invoice operations use LockService for thread safety.
// Column layout of the "Invoices" sheet:
//  A(1) Invoice Date  B(2) Invoice Number  C(3) Customer Name
//  D(4) GST Number    E(5) HSN Code        F(6) POS/State
//  G(7) Taxable Value H(8) Rate            I(9)  IGST
//  J(10) CGST         K(11) SGST           L(12) Invoice Value
//  M(13) RawData JSON (complete InvoiceData object)
// ═══════════════════════════════════════════════════════════

/**
 * Returns the next sequential BDA/NNN invoice number.
 * Scans all existing rows and finds the highest numeric suffix.
 * Uses LockService so two simultaneous calls can't get the same number.
 */
function getNextInvoiceNumber() {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName("Invoices");
    var maxSeq = 0;

    if (sheet && sheet.getLastRow() > 1) {
      var nums = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
      for (var i = 0; i < nums.length; i++) {
        var val = nums[i][0] ? nums[i][0].toString().trim() : "";
        var m = val.match(/(\d+)\s*$/);
        if (m) {
          var n = parseInt(m[1], 10);
          if (!isNaN(n) && n > maxSeq) maxSeq = n;
        }
      }
    }

    var next = maxSeq + 1;
    var padded = (next < 1000) ? ("000" + next).slice(-3) : String(next);
    return jsonResponse({ success: true, nextInvoiceNumber: "BDA/" + padded });
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}


/**
 * Save or update an invoice in Google Sheets.
 * - Generates invoice number if not provided.
 * - Stores full JSON (RawData) in column M for perfect restoration.
 * - Writes individual items to the "Invoice Items" sheet.
 * - Uses LockService to prevent duplicate numbers from concurrent saves.
 */
function saveInvoice(data) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    var ss = getSpreadsheet();

    // ── Ensure Invoices sheet exists ───────────────────────
    var invSheet = ss.getSheetByName("Invoices");
    if (!invSheet) {
      invSheet = ss.insertSheet("Invoices");
      invSheet.appendRow(["Invoice Date","Invoice Number","Customer Name","GST Number",
        "HSN Code","POS/State","Taxable Value","Rate","IGST","CGST","SGST","Invoice Value","RawData"]);
      invSheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#1a2e4a").setFontColor("#ffffff");
    } else {
      // Make sure column M (RawData) header exists
      if (invSheet.getLastColumn() < 13) {
        invSheet.getRange(1, 13).setValue("RawData");
      }
    }

    // ── Ensure Invoice Items sheet exists ─────────────────
    var itemsSheet = ss.getSheetByName("Invoice Items");
    if (!itemsSheet) {
      itemsSheet = ss.insertSheet("Invoice Items");
      itemsSheet.appendRow(["Timestamp","Invoice Number","Item Code","Description","HSN Code","Unit Price","Quantity","Total Price"]);
      itemsSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#1a2e4a").setFontColor("#ffffff");
    }

    // ── Parse customer and items ───────────────────────────
    var customer = data.customer || {};
    if (typeof customer === "string") { try { customer = JSON.parse(customer); } catch(e) { customer = {}; } }

    var items = data.items || [];
    if (typeof items === "string") { try { items = JSON.parse(items); } catch(e) { items = []; } }

    var custTitle = (customer.title || "").toString().trim();
    var custInst  = (customer.institution || "").toString().trim();
    var custName  = custInst || custTitle || (data.institution || "Customer").toString().trim();

    if (!custName) return jsonResponse({ success: false, error: "Customer name is required." });
    if (!Array.isArray(items) || items.length === 0) return jsonResponse({ success: false, error: "At least one item is required." });

    // ── Generate invoice number if missing ────────────────
    var invoiceNumber = (data.invoiceNumber || "").toString().trim();
    if (!invoiceNumber || invoiceNumber === "AUTO") {
      var maxSeq2 = 0;
      if (invSheet.getLastRow() > 1) {
        var existNums = invSheet.getRange(2, 2, invSheet.getLastRow() - 1, 1).getValues();
        for (var ni = 0; ni < existNums.length; ni++) {
          var nv = existNums[ni][0] ? existNums[ni][0].toString().trim() : "";
          var nm = nv.match(/(\d+)\s*$/);
          if (nm) { var nn = parseInt(nm[1], 10); if (!isNaN(nn) && nn > maxSeq2) maxSeq2 = nn; }
        }
      }
      var nxt = maxSeq2 + 1;
      invoiceNumber = "BDA/" + ((nxt < 1000) ? ("000" + nxt).slice(-3) : String(nxt));
      data.invoiceNumber = invoiceNumber;
    }

    // ── Format invoice date ───────────────────────────────
    var rawDate = (data.invoiceDate || "").toString().trim();
    var fmtDate = rawDate;
    var dm = rawDate.match(/^(\d{4})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
    if (dm) {
      var dd = dm[3].length === 1 ? "0" + dm[3] : dm[3];
      var mo = dm[2].length === 1 ? "0" + dm[2] : dm[2];
      fmtDate = dd + "/" + mo + "/" + dm[1];
    }

    // ── Financial calculations ────────────────────────────
    var subtotal = 0, taxTotal = 0;
    var ratesUsed = [];
    items.forEach(function(item) {
      var p = parseFloat(item.unitPrice) || 0;
      var q = parseFloat(item.quantity)  || 0;
      var taxable = p * q;
      var r = (item.gstRate !== undefined && item.gstRate !== null) ? parseFloat(item.gstRate) : (parseFloat(data.taxRate) || 18);
      subtotal += taxable;
      taxTotal += (taxable * r) / 100;
      if (ratesUsed.indexOf(r) === -1) ratesUsed.push(r);
    });

    var taxType = (data.taxType || "IGST").toString();
    var igst = 0, cgst = 0, sgst = 0;
    if (taxType === "IGST")       igst = taxTotal;
    else if (taxType === "CGST_SGST") { cgst = taxTotal / 2; sgst = taxTotal / 2; }

    var finalTotal = Math.round(subtotal + taxTotal);
    var rateStr  = ratesUsed.map(function(r){ return r + "%"; }).join(", ") || ((data.taxRate || 18) + "%");
    var hsnList  = items.map(function(i){ return (i.hsnCode || "").toString().trim(); }).filter(Boolean);
    var primaryHsn = hsnList.join(", ");
    var custState = (customer.state || data.state || "Delhi").toString().trim();
    var custGstin = (customer.gstin || "N/A").toString().trim();
    var displayName = (custInst && custTitle && custInst !== custTitle) ? (custInst + " (" + custTitle + ")") : custName;

    // Store the complete invoice payload as JSON in column M for lossless restoration
    data.invoiceNumber = invoiceNumber; // ensure number is stamped on the raw object
    var rawDataStr = JSON.stringify(data);

    var rowData = [
      fmtDate, invoiceNumber, displayName, custGstin,
      primaryHsn, custState,
      subtotal.toFixed(2), rateStr,
      igst.toFixed(2), cgst.toFixed(2), sgst.toFixed(2),
      finalTotal.toFixed(2),
      rawDataStr
    ];

    // ── Upsert: update existing row or append new ─────────
    var existingRow = -1;
    if (invSheet.getLastRow() > 1) {
      var checkVals = invSheet.getRange(2, 2, invSheet.getLastRow() - 1, 1).getValues();
      for (var ci = 0; ci < checkVals.length; ci++) {
        if (checkVals[ci][0] && checkVals[ci][0].toString().trim() === invoiceNumber) {
          existingRow = ci + 2;
          break;
        }
      }
    }

    if (existingRow > 1) {
      invSheet.getRange(existingRow, 1, 1, 13).setValues([rowData]);
      // Delete old item rows for this invoice
      if (itemsSheet.getLastRow() > 1) {
        var oldItems = itemsSheet.getRange(2, 2, itemsSheet.getLastRow() - 1, 1).getValues();
        for (var oi = oldItems.length - 1; oi >= 0; oi--) {
          if (oldItems[oi][0] && oldItems[oi][0].toString().trim() === invoiceNumber) {
            itemsSheet.deleteRow(oi + 2);
          }
        }
      }
    } else {
      invSheet.appendRow(rowData);
    }

    // ── Write item rows ───────────────────────────────────
    var ts = new Date();
    items.forEach(function(item) {
      itemsSheet.appendRow([
        ts,
        invoiceNumber,
        (item.code || "").toString().trim(),
        (item.description || "").toString().trim(),
        (item.hsnCode || "").toString().trim(),
        parseFloat(item.unitPrice) || 0,
        parseFloat(item.quantity)  || 0,
        (parseFloat(item.unitPrice) || 0) * (parseFloat(item.quantity) || 0)
      ]);
    });

    return jsonResponse({ success: true, invoiceNumber: invoiceNumber, message: "Invoice " + invoiceNumber + " saved to Google Sheets." });

  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() });
  } finally {
    try { lock.releaseLock(); } catch(e) {}
  }
}



/**
 * Fetch all invoices from Google Sheets.
 * Returns { success: true, invoices: [...] }
 * Each invoice record includes the full RawData JSON for restoration.
 */
function getInvoices() {
  try {
    var ss = getSpreadsheet();
    var invSheet = ss.getSheetByName("Invoices");
    if (!invSheet || invSheet.getLastRow() <= 1) {
      return jsonResponse({ success: true, invoices: [] });
    }

    var lastRow = invSheet.getLastRow();
    var lastCol = invSheet.getLastColumn();
    var values  = invSheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    // Load invoice items into a map keyed by invoiceNumber
    var itemsMap = {};
    var itemsSheet = ss.getSheetByName("Invoice Items");
    if (itemsSheet && itemsSheet.getLastRow() > 1) {
      var itemRows = itemsSheet.getRange(2, 1, itemsSheet.getLastRow() - 1, 8).getValues();
      itemRows.forEach(function(r) {
        var num = r[1] ? r[1].toString().trim() : "";
        if (!num) return;
        if (!itemsMap[num]) itemsMap[num] = [];
        itemsMap[num].push({
          id: "item-" + Math.random().toString(36).slice(2, 9),
          code: r[2] ? r[2].toString() : "",
          description: r[3] ? r[3].toString() : "",
          hsnCode: r[4] ? r[4].toString() : "",
          unitPrice: parseFloat(r[5]) || 0,
          quantity:  parseFloat(r[6]) || 0,
          totalPrice: parseFloat(r[7]) || 0
        });
      });
    }

    var records = [];
    for (var i = 0; i < values.length; i++) {
      var row       = values[i];
      var invDate   = row[0] ? row[0].toString().trim() : "";
      var invNumber = row[1] ? row[1].toString().trim() : "";
      var custName  = row[2] ? row[2].toString().trim() : "";
      var gstin     = row[3] ? row[3].toString().trim() : "N/A";
      var hsn       = row[4] ? row[4].toString().trim() : "";
      var pos       = row[5] ? row[5].toString().trim() : "";
      var taxable   = parseFloat(row[6])  || 0;
      var rateStr2  = row[7] ? row[7].toString().trim() : "18%";
      var igst2     = parseFloat(row[8])  || 0;
      var cgst2     = parseFloat(row[9])  || 0;
      var sgst2     = parseFloat(row[10]) || 0;
      var invVal    = parseFloat(row[11]) || 0;

      if (!invNumber) continue; // skip blank rows

      // Try to restore the full invoice from column M (RawData)
      var invoiceDataObj = null;
      if (lastCol >= 13 && row[12]) {
        try {
          var raw = row[12].toString().trim();
          if (raw.startsWith("{")) invoiceDataObj = JSON.parse(raw);
        } catch(pe) {
          Logger.log("RawData parse error for " + invNumber + ": " + pe);
        }
      }

      // Fallback: reconstruct InvoiceData from sheet columns + items map
      if (!invoiceDataObj) {
        var taxRate2 = parseFloat(rateStr2.replace("%","")) || 18;
        var taxType2 = igst2 > 0 ? "IGST" : "CGST_SGST";
        invoiceDataObj = {
          invoiceNumber: invNumber,
          invoiceDate:   invDate,
          orderNumber:   "",
          orderDate:     "",
          customer: {
            title:       custName,
            institution: custName,
            addressLine1: pos,
            addressLine2: "",
            cityStatePin: pos,
            state:        pos,
            gstin:        gstin,
            phone:        "",
            email:        ""
          },
          items:        itemsMap[invNumber] || [],
          taxType:      taxType2,
          taxRate:      taxRate2,
          paymentTerms: "Payment, within 20 days from the date of submission of the invoice, through bankers cheque or demand draft or RTGS is acceptable to us",
          bankDetails:  {},
          jurisdiction: "All disputes are subject to jurisdiction Delhi only",
          paymentNote:  "If the Invoice not paid within the due date, an interest @18% PA will be charged from the date of invoice",
          companyName:  "For BIOBUSINESS DEVELOPMENT AGENCY",
          contactNumber: "9899571171"
        };
      }

      records.push({
        id:               "inv-" + invNumber.replace(/[^a-zA-Z0-9]/g, "-"),
        invoiceNumber:    invNumber,
        customerName:     custName,
        institution:      custName,
        date:             invDate,
        totalAmount:      invVal || taxable,
        savedAt:          new Date().toISOString(),
        data:             invoiceDataObj,
        syncedToGoogleSheets: true
      });
    }

    // Newest first
    records.reverse();
    return jsonResponse({ success: true, invoices: records });
  } catch (err) {
    Logger.log("getInvoices error: " + err.toString());
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
