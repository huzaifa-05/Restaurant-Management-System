import { Save } from "lucide-react";
import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  category: "Beef Burgers",
  description: "",
  price: "",
  image: "",
  available: true,
  featured: false
};

export function AdminMenuForm({ editingItem, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(editingItem ? { ...editingItem } : emptyForm);
  }, [editingItem]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  async function submit(event) {
    event.preventDefault();
    await onSubmit({ ...form, price: Number(form.price) });
    setForm(emptyForm);
  }

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Name
          <input name="name" value={form.name} onChange={updateField} required />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={updateField}>
            <option>Beef Burgers</option>
            <option>Pizza</option>
            <option>Pasta</option>
            <option>Biryani</option>
          </select>
        </label>
        <label>
          Price
          <input name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={updateField} required />
        </label>
        <label>
          Image URL
          <input name="image" value={form.image} onChange={updateField} required />
        </label>
      </div>
      <label>
        Description
        <textarea name="description" rows="3" value={form.description} onChange={updateField} required />
      </label>
      <div className="check-row">
        <label>
          <input type="checkbox" name="available" checked={form.available} onChange={updateField} />
          Available
        </label>
        <label>
          <input type="checkbox" name="featured" checked={form.featured} onChange={updateField} />
          Featured
        </label>
      </div>
      <div className="form-actions">
        <button className="primary-button" type="submit">
          <Save size={18} />
          {editingItem ? "Save Item" : "Add Item"}
        </button>
        {editingItem && (
          <button className="secondary-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
