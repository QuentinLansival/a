import { useState } from 'react';
import { data } from '../data';

function normalize(str) {
  return (str || "").toString().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function uniqueValues(field) {
  return [...new Set(data.map((item) => item[field] || "-"))];
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ marque: "", gamme: "", charge: "" });

  const filtered = data.filter((item) => {
    const matchesSearch = normalize(item.designation).includes(normalize(search)) ||
                          normalize(item.code).includes(normalize(search));
    const matchesFilters = Object.entries(filters).every(([key, val]) =>
      val === "" || normalize(item[key]) === normalize(val)
    );
    return matchesSearch && matchesFilters;
  });

  const updateFilter = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-center">Catalogue Coffrage</h1>
      <input
        type="text"
        placeholder="Rechercher une pièce..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex flex-wrap gap-4">
        {["marque", "gamme", "charge"].map((field) => (
          <select
            key={field}
            className="p-2 border rounded"
            onChange={(e) => updateFilter(field, e.target.value)}
            value={filters[field]}
          >
            <option value="">Tous les {field}s</option>
            {uniqueValues(field).map((val) => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <div key={item.code} className="p-4 border rounded shadow">
            <img
              src={`/images/${item.code}.jpg`}
              alt={item.designation}
              className="w-full h-48 object-contain bg-gray-100 rounded mb-2"
              onError={(e) => e.target.src = "/images/placeholder.jpg"}
            />
            <h2 className="text-lg font-semibold">{item.designation}</h2>
            <p className="text-sm text-gray-600">Code : {item.code}</p>
            <p className="text-sm">Marque : {item.marque}</p>
            <p className="text-sm">Gamme : {item.gamme}</p>
            <p className="text-sm">Charge : {item.charge}</p>
            <p className="text-sm">Dimensions : {item.longueur} x {item.largeur} x {item.hauteur} cm</p>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-center col-span-full">Aucun résultat</p>}
      </div>
    </div>
  );
}