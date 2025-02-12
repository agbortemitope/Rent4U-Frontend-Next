export default function UserDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Welcome, User!</h3>
        <p className="mb-4">Here's what you can do:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Search for properties</li>
          <li>View your booking history</li>
          <li>Manage your profile</li>
          <li>Leave reviews for properties you've rented</li>
        </ul>
      </div>
    </div>
  )
}

