export default function formattedDate(input?: string | null) {
  if (!input) return "--";
  return new Date(input).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
