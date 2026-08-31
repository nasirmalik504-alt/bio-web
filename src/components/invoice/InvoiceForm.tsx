import React, { useState } from 'react';
import { InvoiceData, InvoiceItem } from '../../types/invoiceTypes';
import { PRODUCTS_DATA } from '../../data/productsData';
import { DEFAULT_COMPANY_CONFIG } from '../../config/invoiceConfig';
import { Plus, Trash2, Search, RefreshCw, ChevronDown, ChevronUp, AlertCircle, Settings } from 'lucide-react';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  onFetchNextInvoiceNumber: () => void;
  isFetchingNextNum?: boolean;
  errors: Record<string, string>;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  data,
  onChange,
  onFetchNextInvoiceNumber,
  isFetchingNextNum,
  errors
}) => {
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [showProductDropdownIdx, setShowProductDropdownIdx] = useState<number | null>(null);
  const [showConfigSection, setShowConfigSection] = useState(false);

  // Update customer fields
  const handleCustomerChange = (field: string, value: string) => {
    onChange({
      ...data,
      customer: {
        ...data.customer,
        [field]: value
      }
    });
  };

  // Update shipping address fields
  const handleShippingChange = (field: string, value: string) => {
    onChange({
      ...data,
      shippingAddress: {
        title: data.shippingAddress?.title || data.customer.title,
        addressLine1: data.shippingAddress?.addressLine1 || '',
        addressLine2: data.shippingAddress?.addressLine2 || '',
        cityStatePin: data.shippingAddress?.cityStatePin || '',
        state: data.shippingAddress?.state || '',
        gstin: data.shippingAddress?.gstin || '',
        phone: data.shippingAddress?.phone || '',
        [field]: value
      }
    });
  };

  const handleToggleShipToSameAsBillTo = (same: boolean) => {
    if (same) {
      onChange({
        ...data,
        isShipToSameAsBillTo: true,
        shippingAddress: {
          title: data.customer.title,
          addressLine1: data.customer.addressLine1,
          addressLine2: data.customer.addressLine2,
          cityStatePin: data.customer.cityStatePin,
          state: data.customer.state,
          gstin: data.customer.gstin,
          phone: data.customer.phone
        }
      });
    } else {
      onChange({
        ...data,
        isShipToSameAsBillTo: false,
        shippingAddress: data.shippingAddress || {
          title: data.customer.title,
          addressLine1: data.customer.addressLine1,
          addressLine2: data.customer.addressLine2,
          cityStatePin: data.customer.cityStatePin,
          state: data.customer.state,
          gstin: data.customer.gstin,
          phone: data.customer.phone
        }
      });
    }
  };

  // Update top-level invoice fields
  const handleFieldChange = (field: keyof InvoiceData, value: any) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Item row operations
  const handleItemChange = (index: number, field: keyof InvoiceItem | 'unitPriceInclGst', value: any) => {
    const newItems = [...data.items];
    const targetItem = { ...newItems[index] };
    const itemGstRate = targetItem.gstRate !== undefined ? Number(targetItem.gstRate) : Number(data.taxRate || 18);

    if (field === 'description') {
      // Strip HSN Code text block from description text
      targetItem.description = String(value).replace(/\n?HSN Code\s*\d+/gi, '').trimStart();
    } else if (field === 'gstRate') {
      const rate = parseFloat(value);
      targetItem.gstRate = !isNaN(rate) ? rate : 18;
      const price = Number(targetItem.unitPrice || 0);
      const qty = Number(targetItem.quantity || 0);
      targetItem.totalPrice = price * qty;
    } else if (field === 'unitPriceInclGst') {
      const inclPrice = parseFloat(value);
      const exclPrice = !isNaN(inclPrice) && inclPrice >= 0 ? inclPrice / (1 + itemGstRate / 100) : 0;
      targetItem.unitPrice = exclPrice;
      const qty = Number(targetItem.quantity || 0);
      targetItem.totalPrice = exclPrice * (isNaN(qty) ? 0 : qty);
    } else if (field === 'unitPrice' || field === 'quantity') {
      if (field === 'unitPrice') {
        targetItem.unitPrice = parseFloat(value) || 0;
      }
      if (field === 'quantity') {
        targetItem.quantity = parseFloat(value) || 0;
      }
      const price = Number(targetItem.unitPrice || 0);
      const qty = Number(targetItem.quantity || 0);
      targetItem.totalPrice = price * qty;
    } else {
      (targetItem as any)[field] = value;
    }

    newItems[index] = targetItem;
    onChange({ ...data, items: newItems });
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      code: '',
      description: '',
      hsnCode: '',
      unitPrice: 0,
      quantity: 1,
      gstRate: data.taxRate || 18,
      totalPrice: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const handleRemoveItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, idx) => idx !== index);
    onChange({ ...data, items: newItems });
  };

  // Select item from website product database
  const handleSelectProduct = (index: number, selectedProduct: any) => {
    const name = selectedProduct.name || selectedProduct.title || '';
    const sku = selectedProduct.sku || selectedProduct.catNo || selectedProduct.manufacturerCatNo || 'BB-ITEM';
    const hsn = selectedProduct.hsn || selectedProduct.specifications?.['HSN Code'] || '';
    const price = selectedProduct.internalPricing?.unitPrice || selectedProduct.price || 0;
    
    // Construct rich multiline description (excluding HSN Code line since HSN Code has its own field)
    let desc = `${name}`;
    if (selectedProduct.brand) desc += ` (${selectedProduct.brand})`;
    if (selectedProduct.volume) desc += `\nVolume: ${selectedProduct.volume}`;
    if (selectedProduct.micron) desc += `\nPore Size: ${selectedProduct.micron} μm`;
    if (selectedProduct.diameter) desc += `\nMembrane Diameter: ${selectedProduct.diameter}`;
    if (selectedProduct.material) desc += `\nMaterial: ${selectedProduct.material}`;
    // Strip any existing HSN Code line from description
    desc = desc.replace(/\n?HSN Code\s*\d+/gi, '').trim();

    const newItems = [...data.items];
    newItems[index] = {
      ...newItems[index],
      code: sku,
      description: desc,
      hsnCode: hsn,
      unitPrice: price,
      totalPrice: price * (newItems[index].quantity || 1)
    };

    onChange({ ...data, items: newItems });
    setShowProductDropdownIdx(null);
    setProductSearchTerm('');
  };

  // Filter products for dropdown
  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    if (!productSearchTerm) return true;
    const q = productSearchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }).slice(0, 15);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E6ECF5] shadow-xs space-y-8 text-[#23324D]">
      
      {/* SECTION 1: Customer Details */}
      <div>
        <h3 className="text-base font-bold text-[#23324D] border-b border-[#E6ECF5] pb-2 flex items-center gap-2">
          <span>🏢</span> Customer Billing Details (Bill To)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Customer Title / Designation / Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customer.title}
              onChange={(e) => handleCustomerChange('title', e.target.value)}
              placeholder="e.g. Assistant Administrative Officer (AAO)"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customer.addressLine1}
              onChange={(e) => handleCustomerChange('addressLine1', e.target.value)}
              placeholder="e.g. Bemloe"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
            {errors.addressLine1 && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.addressLine1}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              value={data.customer.addressLine2 || ''}
              onChange={(e) => handleCustomerChange('addressLine2', e.target.value)}
              placeholder="e.g. Near Bus Stand"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              City & PIN Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customer.cityStatePin}
              onChange={(e) => handleCustomerChange('cityStatePin', e.target.value)}
              placeholder="e.g. SHIMLA-171001"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
            {errors.cityStatePin && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.cityStatePin}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.customer.state}
              onChange={(e) => handleCustomerChange('state', e.target.value)}
              placeholder="e.g. Himachal Pradesh"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
            {errors.state && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.state}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Customer GSTIN (Optional)
            </label>
            <input
              type="text"
              value={data.customer.gstin || ''}
              onChange={(e) => handleCustomerChange('gstin', e.target.value)}
              placeholder="e.g. 02AAACC1234F1Z5"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase font-mono"
            />
            {errors.gstin && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.gstin}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Contact Number (Optional)
            </label>
            <input
              type="text"
              value={data.customer.phone || ''}
              onChange={(e) => handleCustomerChange('phone', e.target.value)}
              placeholder="e.g. 9899571171"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1B: Shipping Details (Ship To) */}
      <div className="border-t border-[#E6ECF5] pt-4">
        <div className="flex items-center justify-between border-b border-[#E6ECF5] pb-2">
          <h3 className="text-base font-bold text-[#23324D] flex items-center gap-2">
            <span>🚚</span> Shipping Details (Ship To)
          </h3>
          <label className="flex items-center gap-2 text-xs font-bold text-[#23324D] cursor-pointer bg-[#F4F8FC] px-3 py-1.5 rounded-xl border border-[#E6ECF5] hover:bg-[#EAF2FF] transition-colors">
            <input
              type="checkbox"
              checked={data.isShipToSameAsBillTo !== false}
              onChange={(e) => handleToggleShipToSameAsBillTo(e.target.checked)}
              className="w-4 h-4 rounded text-[#6EA8FE] focus:ring-[#6EA8FE] cursor-pointer"
            />
            <span>Ship to is same as Bill to</span>
          </label>
        </div>

        {data.isShipToSameAsBillTo === false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-[#F9FAFC] p-4 rounded-xl border border-[#E6ECF5]">
            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                Ship To Designation / Name
              </label>
              <input
                type="text"
                value={data.shippingAddress?.title || ''}
                onChange={(e) => handleShippingChange('title', e.target.value)}
                placeholder="e.g. Store Incharge / Receiving Officer"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                Shipping Address Line 1
              </label>
              <input
                type="text"
                value={data.shippingAddress?.addressLine1 || ''}
                onChange={(e) => handleShippingChange('addressLine1', e.target.value)}
                placeholder="e.g. Central Store, Main Block"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                Shipping Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={data.shippingAddress?.addressLine2 || ''}
                onChange={(e) => handleShippingChange('addressLine2', e.target.value)}
                placeholder="e.g. Gate No. 2"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                City & PIN Code
              </label>
              <input
                type="text"
                value={data.shippingAddress?.cityStatePin || ''}
                onChange={(e) => handleShippingChange('cityStatePin', e.target.value)}
                placeholder="e.g. SHIMLA-171001"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                State
              </label>
              <input
                type="text"
                value={data.shippingAddress?.state || ''}
                onChange={(e) => handleShippingChange('state', e.target.value)}
                placeholder="e.g. Himachal Pradesh"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                Ship To GSTIN (Optional)
              </label>
              <input
                type="text"
                value={data.shippingAddress?.gstin || ''}
                onChange={(e) => handleShippingChange('gstin', e.target.value)}
                placeholder="e.g. 02AAACC1234F1Z5"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none uppercase font-mono bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5F708A] mb-1">
                Ship To Contact Number (Optional)
              </label>
              <input
                type="text"
                value={data.shippingAddress?.phone || ''}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                placeholder="e.g. 9899571171"
                className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Invoice & Order Metadata */}
      <div>
        <h3 className="text-base font-bold text-[#23324D] border-b border-[#E6ECF5] pb-2 flex items-center gap-2">
          <span>📋</span> Invoice & Order Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1 flex items-center justify-between">
              <span>Invoice Number <span className="text-xs text-[#6EA8FE] font-normal">(Auto-assigned on Save)</span></span>
              <button
                type="button"
                onClick={onFetchNextInvoiceNumber}
                disabled={isFetchingNextNum}
                className="text-[11px] text-[#6EA8FE] hover:underline flex items-center gap-1 font-normal cursor-pointer"
                title="Fetch next sequential number from Google Sheets"
              >
                <RefreshCw className={`w-3 h-3 ${isFetchingNextNum ? 'animate-spin' : ''}`} /> Refresh Sequence
              </button>
            </label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
              placeholder="Auto-assigned on save (e.g. BDA/004)"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none bg-[#FAFBFD]"
            />
            {errors.invoiceNumber && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.invoiceNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Invoice Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={data.invoiceDate}
              onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono"
            />
            {errors.invoiceDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3"/>{errors.invoiceDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Order Number
            </label>
            <input
              type="text"
              value={data.orderNumber}
              onChange={(e) => handleFieldChange('orderNumber', e.target.value)}
              placeholder="e.g. CPRI/2026/01"
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl font-mono focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#5F708A] mb-1">
              Order Date
            </label>
            <input
              type="date"
              value={data.orderDate}
              onChange={(e) => handleFieldChange('orderDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Products Table */}
      <div>
        <div className="flex items-center justify-between border-b border-[#E6ECF5] pb-2">
          <h3 className="text-base font-bold text-[#23324D] flex items-center gap-2">
            <span>🧪</span> Product Items
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1.5 bg-[#6EA8FE] hover:bg-[#5896EE] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {errors.items && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {errors.items}
          </p>
        )}

        <div className="space-y-4 mt-4">
          {data.items.map((item, idx) => (
            <div key={item.id || idx} className="p-4 rounded-xl border border-[#E6ECF5] bg-[#FDFEFF] relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#23324D] bg-[#F4F8FC] px-2.5 py-1 rounded-lg border border-[#E6ECF5]">
                  Item #{idx + 1}
                </span>

                {/* Select from BioBusiness Catalog Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductDropdownIdx(showProductDropdownIdx === idx ? null : idx);
                      setProductSearchTerm('');
                    }}
                    className="text-xs font-semibold text-[#6EA8FE] hover:text-[#23324D] bg-[#EAF2FF] px-3 py-1.5 rounded-lg border border-[#C5DCFF] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" /> Pick from BioBusiness Catalog
                  </button>

                  {/* Dropdown Menu */}
                  {showProductDropdownIdx === idx && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#E6ECF5] rounded-xl shadow-xl z-50 p-2 space-y-2 max-h-72 overflow-y-auto">
                      <input
                        type="text"
                        value={productSearchTerm}
                        onChange={(e) => setProductSearchTerm(e.target.value)}
                        placeholder="Search product name, SKU, brand..."
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E6ECF5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6EA8FE]"
                        autoFocus
                      />
                      <div className="divide-y divide-[#E6ECF5]">
                        {filteredProducts.map((prod) => (
                          <button
                            key={prod.id}
                            type="button"
                            onClick={() => handleSelectProduct(idx, prod)}
                            className="w-full text-left p-2 hover:bg-[#F4F8FC] rounded-lg transition-colors cursor-pointer block"
                          >
                            <div className="text-xs font-bold text-[#23324D] line-clamp-1">{prod.name}</div>
                            <div className="text-[10px] text-[#5F708A] flex items-center justify-between mt-0.5">
                              <span>SKU: {prod.sku}</span>
                              <span className="font-mono text-[#6EA8FE]">₹{prod.internalPricing?.unitPrice || 0}</span>
                            </div>
                          </button>
                        ))}

                        {filteredProducts.length === 0 && (
                          <div className="p-3 text-center text-xs text-[#5F708A]">No matching products found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {/* Row 1: Code, HSN, Quantity, GST Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Code / SKU */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      Product Code / SKU
                    </label>
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleItemChange(idx, 'code', e.target.value)}
                      placeholder="e.g. AX-SF-PES-02"
                      className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl font-mono focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
                    />
                  </div>

                  {/* HSN Code */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      HSN Code
                    </label>
                    <input
                      type="text"
                      value={item.hsnCode}
                      onChange={(e) => handleItemChange(idx, 'hsnCode', e.target.value)}
                      placeholder="e.g. 84212900"
                      className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl font-mono focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      placeholder="100"
                      className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl font-mono focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none"
                    />
                  </div>

                  {/* Tax Type per Product */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      Tax Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.taxType || data.taxType || 'IGST'}
                      onChange={(e) => handleItemChange(idx, 'taxType', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#6EA8FE]/40 bg-[#F4F8FC] rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none text-[#23324D]"
                    >
                      <option value="IGST">IGST</option>
                      <option value="CGST_SGST">CGST + SGST</option>
                      <option value="NONE">No Tax (0%)</option>
                    </select>
                  </div>

                  {/* GST Rate (%) per Product */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      GST Rate (%) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18)}
                      onChange={(e) => handleItemChange(idx, 'gstRate', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-[#6EA8FE]/40 bg-[#F4F8FC] rounded-xl font-mono font-bold focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none text-[#23324D]"
                    >
                      <option value={18}>18% GST (Standard)</option>
                      <option value={12}>12% GST</option>
                      <option value={5}>5% GST (Concessional)</option>
                      <option value={28}>28% GST</option>
                      <option value={0}>0% GST (Exempt / Nil)</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: Dual Unit Prices (Excl. GST & Incl. GST) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Unit Price (Excl. GST) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                      Unit Price (Excl. GST ₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={item.unitPrice ? item.unitPrice : ''}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      placeholder="e.g. 7012.7119"
                      className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl font-mono focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-bold text-[#23324D]"
                    />
                  </div>

                  {/* Unit Price (Incl. GST) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#1B6D4A] mb-1">
                      Unit Price (Incl. {item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18)}% GST ₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={
                        item.unitPrice
                          ? Number((Number(item.unitPrice) * (1 + Number(item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18)) / 100)).toFixed(2))
                          : ''
                      }
                      onChange={(e) => handleItemChange(idx, 'unitPriceInclGst', e.target.value)}
                      placeholder="e.g. 7363.35"
                      className="w-full px-3 py-2 text-xs border border-[#A8E6CE] bg-[#F4FDF9] rounded-xl font-mono font-bold text-[#1B6D4A] focus:ring-2 focus:ring-[#1B6D4A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row 3: Description of Articles */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#5F708A] mb-1">
                    Description of Articles <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    placeholder="Axiva Syringe Filter PES&#10;Pore Size 0.2 Micrometer&#10;Membrane Diameter 4 mm&#10;Pack Size: 100/Pack"
                    className="w-full px-3 py-2 text-xs border border-[#E6ECF5] rounded-xl focus:ring-2 focus:ring-[#6EA8FE] focus:outline-none font-sans"
                  />
                </div>

                {/* Row 4: Line Amount Summary & Delete Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E6ECF5] text-xs gap-2">
                  <div className="flex flex-wrap items-center gap-3 text-[#5F708A] font-mono text-[11px]">
                    <span>
                      Taxable Subtotal: <strong className="text-[#23324D] font-bold">₹{(Number(item.unitPrice || 0) * Number(item.quantity || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      GST ({item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18)}%): <strong className="text-[#6EA8FE] font-bold">₹{((Number(item.unitPrice || 0) * Number(item.quantity || 0) * Number(item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18))) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Line Total (Incl. GST): <strong className="text-[#1B6D4A] font-bold">₹{(Number(item.unitPrice || 0) * Number(item.quantity || 0) * (1 + Number(item.gstRate !== undefined ? item.gstRate : (data.taxRate || 18))/100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </span>
                  </div>

                  {data.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1 shrink-0"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Row
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Central Company & Bank Setup Link */}
      <div className="border-t border-[#E6ECF5] pt-4">
        <div className="p-3.5 bg-[#F4F8FC] rounded-xl border border-[#E6ECF5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#23324D]">
            <span className="text-xl">🏦</span>
            <div>
              <span className="font-bold block text-xs">Bank Details, Terms & Signatory Configured</span>
              <p className="text-[11px] text-[#5F708A] mt-0.5">
                Bank account details, payment terms, jurisdiction & signatory heading are managed centrally in <strong>Company & Bank Setup</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.set('tab', 'settings');
              window.location.href = url.toString();
            }}
            className="px-3 py-1.5 bg-[#23324D] hover:bg-[#1A263B] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#6EA8FE]" /> Open Setup
          </button>
        </div>
      </div>
    </div>
  );
};
