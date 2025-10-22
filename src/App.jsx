import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [item, setItem] = useState(null);
  const [bans, setBans] = useState([]);
  const [loading, setLoading] = useState(false);

  const blocked = (breed) => {
    if (!breed) return true;
    const name = breed.name?.toUpperCase() || "";
    const origin = breed.origin?.toUpperCase() || "";
    return bans.includes(name) || bans.includes(origin);
  };

  const pick = async () => {
    setLoading(true);
    try {
      let tries = 0;
      let choice = null;
      while (tries < 12 && !choice) {
        const res = await fetch(
          "https://api.thecatapi.com/v1/images/search?has_breeds=1&size=med&mime_types=jpg,png&order=Rand&limit=1",
          { headers: { "x-api-key": "live_7nFrcf8hp6l4xqf5EE0A6w3HS8HXQ6WGUoPbo7NuhvtGjgVGfN8Mdq0r1r5tCj8F" } }
        );
        const json = await res.json();
        const hit = Array.isArray(json) ? json[0] : null;
        const breed = hit?.breeds?.[0];
        if (hit && breed && !blocked(breed)) {
          choice = {
            url: hit.url,
            breed: breed.name,
            origin: breed.origin || "N/A",
            life: breed.life_span ? `${breed.life_span} yrs` : "N/A",
            temperament: breed.temperament || "N/A",
          };
        }
        tries++;
      }
      if (!choice) {
        alert("Everything is filtered out. Remove something from the ban list.");
        return;
      }
      setItem(choice);
    } catch (e) {
      alert("Could not load a result. Try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addBan = (v) => {
    const key = String(v || "").toUpperCase();
    if (!key) return;
    if (!bans.includes(key)) setBans((prev) => [...prev, key]);
  };

  const removeBan = (v) => {
    const key = String(v || "").toUpperCase();
    setBans((prev) => prev.filter((x) => x !== key));
  };

  useEffect(() => {
    pick();
  }, []);

  return (
    <div className="app">
      <div className="wrap">
        <div className="head">
          <h1>Veni Vici: Cat Explorer</h1>
          <button onClick={pick} disabled={loading}>
            {loading ? "Loading..." : "Discover 🐾"}
          </button>
        </div>

        {item && (
          <div className="card">
            <img className="photo" src={item.url} alt={item.breed} />
            <h2>
              <span className="click" onClick={() => addBan(item.breed)}>
                {item.breed}
              </span>
            </h2>
            <div className="rows">
              <p>
                Origin:{" "}
                <span className="click" onClick={() => addBan(item.origin)}>
                  {item.origin}
                </span>
              </p>
              <p>
                Life Span: <span>{item.life}</span>
              </p>
              <p className="temp">
                Temperament: <span>{item.temperament}</span>
              </p>
            </div>
          </div>
        )}

        <div className="ban">
          <h3>Ban List</h3>
          {bans.length === 0 ? (
            <p className="muted">Nothing banned yet</p>
          ) : (
            <ul>
              {bans.map((b, i) => (
                <li key={i} onClick={() => removeBan(b)}>
                  {b}
                </li>
              ))}
            </ul>
          )}
          <p className="hint">Click a breed or origin above to add it. Click a chip here to remove it.</p>
        </div>
      </div>
    </div>
  );
}
