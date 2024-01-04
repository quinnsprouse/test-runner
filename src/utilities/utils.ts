export function getStatusClassName(status: string) {
  switch (status) {
    case "fail":
      return "bg-red-100 text-red-700";
    case "pass":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700"; // Gray style for 'pending'
    default:
      return "bg-gray-100 text-gray-700"; // Default style, also gray
  }
}
