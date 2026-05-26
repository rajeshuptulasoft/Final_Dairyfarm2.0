import { useState } from "react";
import axios from "axios";
import { Mail, MapPin, Phone, Globe, Send } from "lucide-react";
import ContactBanner from "../components/ContactBanner";
import "../css/contact.css";

const CONTACT_API = "http://localhost/Dariy_farm2.0/backend/api/contact.php";

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Call us",
    value: "+91 98765 43210",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "hello@muktidairy.farm",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Village Road, Mukti Nagar, Gop, Puri District",
  },
  {
    icon: Globe,
    label: "Website",
    value: "www.muktidairyfarm.com",
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", address: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = "Enter a valid email address";
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ""))) nextErrors.mobile = "Enter a 10-digit mobile";
    if (!form.address.trim()) nextErrors.address = "Address is required";
    if (!form.message.trim()) nextErrors.message = "Add a short message";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.replace(/\D/g, ""),
      address: form.address.trim(),
      message: form.message.trim(),
    };

    setSubmitting(true);
    setErrors({});
    try {
      const { data } = await axios.post(CONTACT_API, payload, {
        headers: { "Content-Type": "application/json" },
      });
      if (!data.success) {
        console.log("Contact error:", data.message || "Could not send message");
        setErrors({ form: data.message || "Could not send message" });
        return;
      }
      console.log("Contact success:", data.message);
      setSuccess(true);
      setForm({ name: "", email: "", mobile: "", address: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Network error. Please try again.";
      console.log("Contact error:", errMsg);
      setErrors({ form: errMsg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ContactBanner />

      <section className="section contact-page-section">
        <div className="container">
          <div className="contact-page-grid">
            <aside className="contact-details-panel">
              <h2>We&apos;d love to hear from you</h2>
              <p className="contact-details-lead">
                Reach out for orders, farm visits, or any question about our fresh dairy.
              </p>
              <ul className="contact-details-list">
                {CONTACT_DETAILS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="contact-detail-item">
                      <span className="contact-detail-icon" aria-hidden>
                        <Icon size={20} />
                      </span>
                      <div>
                        <span className="contact-detail-label">{item.label}</span>
                        <span className="contact-detail-value">{item.value}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="contact-hours">Open daily · 5 AM – 8 PM</p>
            </aside>

            <div className="contact-form-panel">
              <div className="contact-form-card">
                <h2>Send us a message</h2>
                <p className="contact-form-sub">Fill in the form and our team will reply within a few hours.</p>

                {success && (
                  <div className="contact-success-banner" role="status">
                    Message sent — our team will get back to you shortly.
                  </div>
                )}

                <form className="contact-page-form" onSubmit={submit} noValidate>
                  <div className="contact-form-row">
                    <div className="field">
                      <label htmlFor="contact-name">Name</label>
                      <input
                        id="contact-name"
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your full name"
                      />
                      {errors.name && <div className="err">{errors.name}</div>}
                    </div>
                    <div className="field">
                      <label htmlFor="contact-email">Email</label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                      />
                      {errors.email && <div className="err">{errors.email}</div>}
                    </div>
                  </div>

                  <div className="contact-form-row">
                    <div className="field">
                      <label htmlFor="contact-mobile">Mobile Number</label>
                      <input
                        id="contact-mobile"
                        type="tel"
                        value={form.mobile}
                        onChange={update("mobile")}
                        placeholder="10-digit number"
                        inputMode="tel"
                      />
                      {errors.mobile && <div className="err">{errors.mobile}</div>}
                    </div>
                    <div className="field">
                      <label htmlFor="contact-address">Address</label>
                      <input
                        id="contact-address"
                        value={form.address}
                        onChange={update("address")}
                        placeholder="Your address"
                      />
                      {errors.address && <div className="err">{errors.address}</div>}
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={update("message")}
                      placeholder="How can we help you today?"
                      rows={5}
                    />
                    {errors.message && <div className="err">{errors.message}</div>}
                  </div>

                  {errors.form && <div className="err">{errors.form}</div>}

                  <button type="submit" className="contact-submit-btn" disabled={submitting}>
                    <Send size={18} />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="contact-map-wrap">
            <iframe
              title="Mukti Dairy Farm location — Gop, Puri District"
              className="contact-map-iframe"
              src="https://maps.google.com/maps?q=Gop,+Puri,+Odisha&hl=en&z=13&ie=UTF8&iwloc=&output=embed"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="contact-map-label">
              <MapPin size={18} />
              <div>
                <strong>Mukti Dairy Farm</strong>
                <span>Village Road, Mukti Nagar · Gop, Puri District, Odisha</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
