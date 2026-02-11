import { useNavigate, useSearchParams } from "react-router-dom";

const items = [
  { key: "tag", value: "new", label: "New Arrivals" },
  { key: "category", value: "men", label: "Men" },
  { key: "category", value: "women", label: "Women" },
  { key: "category", value: "accessories", label: "Accessories" },
];

export default function FilterChips() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const toggle = (key, value) => {
    const next = new URLSearchParams(sp);
    const current = next.get(key);

    if (current === value) next.delete(key);
    else next.set(key, value);

    navigate({ pathname: "/", search: next.toString() }, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(sp);
    next.delete("tag");
    next.delete("category");

    navigate({ pathname: "/", search: next.toString() }, { replace: true });
  };

  const isActive = (key, value) => sp.get(key) === value;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={clearFilters}
        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
      >
        All
      </button>

      {items.map((it) => {
        const active = isActive(it.key, it.value);
        return (
          <button
            key={`${it.key}:${it.value}`}
            type="button"
            onClick={() => toggle(it.key, it.value)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition",
              active
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900",
            ].join(" ")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
