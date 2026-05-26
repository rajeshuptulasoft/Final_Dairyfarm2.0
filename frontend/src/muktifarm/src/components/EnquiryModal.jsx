import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, X } from "lucide-react";
import axios from "axios";
import "../css/modal.css";

const ENQUIRY_API = "http://localhost/Dariy_farm2.0/backend/api/enquiry.php";

const initForm = {
  productName: "",
  name: "",
  mobile: "",
  address: "",
  quantityAmount: 1,
  quantityUnit: "kg",
  message: "",
};

export default function EnquiryModal({ product, onClose }) {
  const [form, setForm] = useState({ ...initForm, productName: product || "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const changeQty = (delta) => {
    setForm((prev) => ({
      ...prev,
      quantityAmount: Math.max(1, (prev.quantityAmount || 1) + delta),
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.productName.trim()) nextErrors.productName = "Product name is required";
    if (!form.name.trim()) nextErrors.name = "Name is required";
    const digits = form.mobile.replace(/\D/g, "");
    if (!/^\d{10}$/.test(digits)) nextErrors.mobile = "Enter a valid 10-digit mobile number";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.quantityAmount || form.quantityAmount < 1) nextErrors.quantity = "Quantity must be at least 1";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      product_name: form.productName.trim(),
      customer_name: form.name.trim(),
      mobile_number: form.mobile.replace(/\D/g, ""),
      address: form.address.trim(),
      message: form.message.trim(),
    };

    setSubmitting(true);
    try {
      const { data } = await axios.post(ENQUIRY_API, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (!data.success) {
        console.log("Enquiry error:", data.message || "Could not submit enquiry");
        setErrors({ form: data.message || "Could not submit enquiry" });
        return;
      }
      console.log("Enquiry success:", data.message);
      setDone(true);
      setForm({ ...initForm, productName: product || "" });
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Network error. Please try again.";
      console.log("Enquiry error:", errMsg);
      setErrors({ form: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  const displayProduct = form.productName || product;

  const modal = (
    <div
      className="enquiry-modal-backdrop"
      role="presentation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="enquiry-modal-box" role="dialog" aria-modal="true" aria-labelledby="enq-title">
        <button className="enquiry-modal-close" type="button" onClick={onClose} aria-label="Close">
          <X size={22} strokeWidth={2.5} />
        </button>

        {done ? (
          <div className="enquiry-modal-success">
            <div className="enquiry-check">✓</div>
            <h3>Enquiry Sent</h3>
            <p className="enquiry-modal-sub">
              Thank you for your interest in {displayProduct}. Our team will contact you shortly.
            </p>
            <button type="button" className="enquiry-btn-submit" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="enquiry-modal-header">
              <span className="enquiry-pill">Product Enquiry</span>
              <h3 id="enq-title">Enquire about {displayProduct}</h3>
              <p className="enquiry-modal-sub">Fill in your details and we will get back to you soon.</p>
            </div>

            <form className="enquiry-modal-form" onSubmit={submit} noValidate>
              <div className="enquiry-field">
                <label htmlFor="enq-product">Product Name</label>
                <input
                  id="enq-product"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="Product name"
                  required
                />
                {errors.productName && <div className="enquiry-err">{errors.productName}</div>}
              </div>

              <div className="enquiry-field">
                <label htmlFor="enq-name">Name</label>
                <input
                  id="enq-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
                {errors.name && <div className="enquiry-err">{errors.name}</div>}
              </div>

              <div className="enquiry-field">
                <label htmlFor="enq-mobile">Mobile Number</label>
                <input
                  id="enq-mobile"
                  type="tel"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="10-digit mobile number"
                  inputMode="tel"
                  required
                />
                {errors.mobile && <div className="enquiry-err">{errors.mobile}</div>}
              </div>

              <div className="enquiry-field">
                <label htmlFor="enq-address">Address</label>
                <textarea
                  id="enq-address"
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Delivery address"
                  required
                />
                {errors.address && <div className="enquiry-err">{errors.address}</div>}
              </div>

              <div className="enquiry-field">
                <label>Quantity</label>
                <div className="quantity-row">
                  <div className="quantity-unit-side">
                    <span className="quantity-side-label">Unit</span>
                    <select
                      className="qty-unit"
                      value={form.quantityUnit}
                      onChange={(e) => setForm({ ...form, quantityUnit: e.target.value })}
                      aria-label="Unit"
                    >
                      <option value="kg">Kg</option>
                      <option value="liter">Liter</option>
                    </select>
                  </div>
                  <div className="quantity-amount-side">
                    <span className="quantity-side-label">Quantity</span>
                    <div className="quantity-stepper">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => changeQty(-1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={18} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        className="qty-input"
                        value={form.quantityAmount}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            quantityAmount: Math.max(1, parseInt(e.target.value, 10) || 1),
                          })
                        }
                        aria-label="Quantity amount"
                      />
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => changeQty(1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                {errors.quantity && <div className="enquiry-err">{errors.quantity}</div>}
              </div>

              <div className="enquiry-field">
                <label htmlFor="enq-message">Message</label>
                <textarea
                  id="enq-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Any special request or notes"
                />
              </div>

              {errors.form && <div className="enquiry-err">{errors.form}</div>}

              <div className="enquiry-actions-row">
                <button type="button" className="enquiry-btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="enquiry-btn-submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Enquiry Now"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
