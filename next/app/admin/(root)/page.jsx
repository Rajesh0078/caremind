import React from "react";
import {
  BsHousesFill,
  BsPeopleFill,
  BsPersonCheckFill,
  BsCurrencyRupee,
  BsActivity,
} from "react-icons/bs";

const kpis = [
  {
    label: "Total Tenants",
    value: 128,
    icon: <BsHousesFill />,
    color: "bg-blue-100 text-blue-600",
  },
  {
    label: "Total Users",
    value: 5420,
    icon: <BsPeopleFill />,
    color: "bg-green-100 text-green-600",
  },
  {
    label: "Active Users",
    value: 3890,
    icon: <BsPersonCheckFill />,
    color: "bg-purple-100 text-purple-600",
  },
  {
    label: "Monthly Revenue",
    value: "₹4.2L",
    icon: <BsCurrencyRupee />,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    label: "System Health",
    value: "99.9%",
    icon: <BsActivity />,
    color: "bg-red-100 text-red-600",
  },
];

const Admin = () => {
  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold mt-1">{kpi.value}</p>
            </div>

            <div
              className={`p-3 rounded-full text-xl ${kpi.color}`}
            >
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ───────── TOP TENANTS TABLE ───────── */}
      <section className="bg-white my-6 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Tenants</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Tenant</th>
                <th className="py-2">Users</th>
                <th className="py-2">Activity</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Apollo Clinic</td>
                <td className="py-2">230</td>
                <td className="py-2 text-green-600">High</td>
              </tr>
              <tr>
                <td className="py-2">CarePlus</td>
                <td className="py-2">180</td>
                <td className="py-2 text-yellow-600">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ───────── SYSTEM HEALTH ───────── */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>API Uptime: <strong>99.9%</strong></div>
          <div>Error Rate: <strong>0.02%</strong></div>
          <div>Jobs Failed: <strong>0</strong></div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
