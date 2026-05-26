import { calcSaleAmount, SALE_UNIT_OPTIONS } from '../../utils/saleForm';

const PAYMENT_OPTIONS = ['Cash', 'Card', 'Online', 'Credit'];

function getAvailableStock(products, itemId, unit) {
  if (!itemId) return null;
  const item = products.find((p) => String(p.id) === String(itemId));
  if (!item) return null;
  if (unit === 'litre') return item.available_litre ?? 0;
  return item.available_kg ?? 0;
}

export default function SalesFormFields({ form, setForm, products = [] }) {
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const amountPreview = calcSaleAmount(form.quantity, form.rate);
  const available = getAvailableStock(products, form.item_id, form.unit || 'kg');
  const unitLabel = form.unit === 'litre' ? 'litre' : 'kg';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">Sale Date *</label>
        <input
          type="date"
          className="input-field"
          value={form.sale_date}
          onChange={(e) => set('sale_date', e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Customer Name *</label>
        <input
          className="input-field"
          value={form.customer_name}
          onChange={(e) => set('customer_name', e.target.value)}
          placeholder="Customer name"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Customer Phone</label>
        <input
          className="input-field"
          value={form.customer_phone}
          onChange={(e) => set('customer_phone', e.target.value)}
          placeholder="Phone number"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Item *</label>
        <select
          className="input-field"
          value={form.item_id}
          onChange={(e) => set('item_id', e.target.value)}
          required
        >
          <option value="">-- Select Item --</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.item_name}
              {p.item_type ? ` (${p.item_type})` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Quantity *</label>
        <div className="sale-qty-row">
          <input
            type="number"
            step="0.01"
            min="0"
            className="input-field sale-qty-input"
            value={form.quantity}
            onChange={(e) => set('quantity', e.target.value)}
            placeholder={`Enter quantity (${unitLabel})`}
            required
          />
          <select
            className="input-field sale-qty-unit"
            value={form.unit || 'kg'}
            onChange={(e) => set('unit', e.target.value)}
            required
            aria-label="Unit"
          >
            {SALE_UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        {form.item_id && available != null && (
          <p className="text-xs mt-1" style={{ color: available > 0 ? '#16a34a' : '#dc2626' }}>
            Available stock: {available} {unitLabel}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Rate (₹) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          className="input-field"
          value={form.rate}
          onChange={(e) => set('rate', e.target.value)}
          placeholder={`Rate per ${unitLabel}`}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Amount (₹)</label>
        <input
          className="input-field"
          value={amountPreview ? `₹${amountPreview}` : ''}
          readOnly
          placeholder="Auto-calculated"
          tabIndex={-1}
          style={{ background: 'var(--surface-2)' }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Method</label>
        <select
          className="input-field"
          value={form.payment_method}
          onChange={(e) => set('payment_method', e.target.value)}
        >
          {PAYMENT_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          className="input-field"
          rows={3}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Notes"
        />
      </div>
    </div>
  );
}
