import { useState } from "react";
import axios from "axios";
import { Mail, MapPin, Phone } from "lucide-react";
import contactImage from "../../assets/images/contact/img-1.jpg";

const CONTACT_API = "http://localhost/Dariy_farm2.0/backend/api/contact.php";

const CONTACT_INFO = [
  {
    id: "address",
    label: "Address",
    value: "Village Road, Mukti Nagar",
    icon: MapPin,
  },
  {
    id: "phone",
    label: "Phone",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
    icon: Phone,
  },
  {
    id: "email",
    label: "Email",
    value: "hello@muktidairy.farm",
    href: "mailto:hello@muktidairy.farm",
    icon: Mail,
  },
];

const initForm = { name: "", email: "", mobile: "", address: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = async (event) => {
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
      setSubmitted(true);
      setForm(initForm);
      setTimeout(() => setSubmitted(false), 5000);
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
    <section className="section contact-section">
      <div className="container contact-grid">
        <div className="contact-copy">
          <p className="eyebrow">Get in touch</p>
          <h2>Questions or farm visits? We’re happy to help.</h2>
          <p>
            Send us a message and our team will respond quickly. Whether you need product details, delivery
            scheduling, or farm tour information, we’re here for you.
          </p>
          <div className="contact-image">
            <img src={contactImage} alt="Contact the farm" />
          </div>
          <div className="contact-info-cards" aria-label="Contact information">
            {CONTACT_INFO.map((item) => {
              const Icon = item.icon;
              const content = item.href ? (
                <a href={item.href} className="contact-info-card__value contact-info-card__value--link">
                  {item.value}
                </a>
              ) : (
                <p className="contact-info-card__value">{item.value}</p>
              );

              return (
                <article key={item.id} className="contact-info-card">
                  <span className="contact-info-card__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <div className="contact-info-card__body">
                    <span className="contact-info-card__label">{item.label}</span>
                    {content}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="contact-form-card">
          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Your full name"
                required
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@example.com"
                required
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>
            <div className="form-row">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                id="mobile"
                type="tel"
                value={form.mobile}
                onChange={update("mobile")}
                placeholder="10-digit number"
                inputMode="tel"
                required
              />
              {errors.mobile && <p className="form-error">{errors.mobile}</p>}
            </div>
            <div className="form-row">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={update("address")}
                placeholder="Your address"
                required
              />
              {errors.address && <p className="form-error">{errors.address}</p>}
            </div>
            <div className="form-row">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="How can we help you today?"
                required
              />
              {errors.message && <p className="form-error">{errors.message}</p>}
            </div>
            {errors.form && <p className="form-error">{errors.form}</p>}
            <button type="submit" className="btn btn-primary form-submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send message"}
            </button>
            {submitted && <p className="form-success">Thanks! We’ll be in touch soon.</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
