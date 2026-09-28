export default function Avatar({ name, color = "#1B1F3B", size = 36 }) {
  const initial = name ? name.trim().charAt(0).toUpperCase() : "?";
  return (
    <div
      className="rounded-full flex items-center justify-center font-display font-medium text-paper shrink-0"
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.42 }}
      title={name}
    >
      {initial}
    </div>
  );
}
