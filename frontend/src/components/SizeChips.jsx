import React, { useState } from "react";

export default function SizeChips({ sizes, setSizes }) {
  const [input, setInput] = useState("");

  const addSize = () => {
    const val = input.trim();
    if (!val) return;
    if (sizes.includes(val)) {
      setInput("");
      return;
    }
    setSizes([...sizes, val]);
    setInput("");
  };

  const remove = (s) => setSizes(sizes.filter((x) => x !== s));

  return (
    <div>
      <div className="flex gap-2 flex-wrap mb-3">
        {sizes.map((s) => (
          <div key={s} className="px-3 py-1 rounded-full bg-gray-200 inline-flex items-center gap-2">
            <span>{s}</span>
            <button onClick={() => remove(s)} className="text-sm">&times;</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSize()}
          placeholder="Add size (e.g., 500g, 1kg, XL)"
          className="border rounded px-3 py-1 flex-1"
        />
        <button onClick={addSize} className="px-4 py-1 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </div>
  );
}
