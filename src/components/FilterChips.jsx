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

    const isActive = (key, value) => sp.get(key) === value;

    return (
        <div className="flex flex-wrap gap-3">
            {items.map((it) => {
                const active = isActive(it.key, it.value);
                return (
                    <button
                        key={`${it.key}:${it.value}`}
                        type="button"
                        onClick={() => toggle(it.key, it.value)}
                        className={[
                            "btn rounded-full px-4 py-2 text-sm",
                            active ? "bg-gray-900 text-white" : "border border-gray-300 bg-white hover:bg-gray-50",
                        ].join(" ")}
                    >
                        {it.label}
                    </button>
                );
            })}
        </div>
    );
}
