export default function EmptyState({ title, subtitle }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-sm mt-1">{subtitle}</p>
    </div>
  );
}
