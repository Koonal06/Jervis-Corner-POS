import { useState } from "react";
import { Plus, Edit, Trash2, Users, Calendar, X } from "lucide-react";

interface Staff {
  id: number;
  name: string;
  role: "Admin" | "Cashier" | "Cook" | "Cleaner" | "Manager";
  phone: string;
  email: string;
  status: "Active" | "Inactive";
}

interface Shift {
  staffId: number;
  staffName: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export function StaffManagement() {
  const [activeTab, setActiveTab] = useState<"staff" | "schedule">("staff");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState<Omit<Staff, "id">>({
    name: "",
    role: "Cashier",
    phone: "",
    email: "",
    status: "Active",
  });

  const [staffList, setStaffList] = useState<Staff[]>([
    { id: 1, name: "John Dela Cruz", role: "Manager", phone: "0917-123-4567", email: "john@jervis.com", status: "Active" },
    { id: 2, name: "Maria Santos", role: "Cashier", phone: "0918-234-5678", email: "maria@jervis.com", status: "Active" },
    { id: 3, name: "Pedro Reyes", role: "Cook", phone: "0919-345-6789", email: "pedro@jervis.com", status: "Active" },
    { id: 4, name: "Ana Garcia", role: "Cashier", phone: "0920-456-7890", email: "ana@jervis.com", status: "Active" },
    { id: 5, name: "Jose Ramos", role: "Cook", phone: "0921-567-8901", email: "jose@jervis.com", status: "Active" },
    { id: 6, name: "Lisa Cruz", role: "Cleaner", phone: "0922-678-9012", email: "lisa@jervis.com", status: "Inactive" },
  ]);

  const [schedules, setSchedules] = useState<Shift[]>([
    { staffId: 2, staffName: "Maria Santos", monday: "9AM-5PM", tuesday: "9AM-5PM", wednesday: "9AM-5PM", thursday: "9AM-5PM", friday: "9AM-5PM", saturday: "OFF", sunday: "OFF" },
    { staffId: 3, staffName: "Pedro Reyes", monday: "7AM-3PM", tuesday: "7AM-3PM", wednesday: "OFF", thursday: "7AM-3PM", friday: "7AM-3PM", saturday: "7AM-3PM", sunday: "7AM-3PM" },
    { staffId: 4, staffName: "Ana Garcia", monday: "2PM-10PM", tuesday: "2PM-10PM", wednesday: "2PM-10PM", thursday: "OFF", friday: "2PM-10PM", saturday: "2PM-10PM", sunday: "OFF" },
    { staffId: 5, staffName: "Jose Ramos", monday: "3PM-11PM", tuesday: "OFF", wednesday: "3PM-11PM", thursday: "3PM-11PM", friday: "3PM-11PM", saturday: "OFF", sunday: "3PM-11PM" },
  ]);

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.phone || !newStaff.email) {
      alert("Please fill in all fields");
      return;
    }

    const newId = Math.max(...staffList.map(staff => staff.id), 0) + 1;
    setStaffList([...staffList, { ...newStaff, id: newId }]);
    setShowAddModal(false);
    setNewStaff({
      name: "",
      role: "Cashier",
      phone: "",
      email: "",
      status: "Active",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Manager": return "bg-purple-100 text-purple-700";
      case "Cashier": return "bg-blue-100 text-blue-700";
      case "Cook": return "bg-orange-100 text-orange-700";
      case "Cleaner": return "bg-green-100 text-green-700";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  const roleStats = [
    { role: "Manager", count: staffList.filter(s => s.role === "Manager").length, color: "from-purple-500 to-purple-600" },
    { role: "Cashier", count: staffList.filter(s => s.role === "Cashier").length, color: "from-blue-500 to-blue-600" },
    { role: "Cook", count: staffList.filter(s => s.role === "Cook").length, color: "from-orange-500 to-orange-600" },
    { role: "Cleaner", count: staffList.filter(s => s.role === "Cleaner").length, color: "from-green-500 to-green-600" },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-accent mb-2">Staff Management</h1>
          <p className="text-neutral-500">Manage staff members and schedules</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-neutral-800">{staffList.length}</h3>
          <p className="text-neutral-500 text-sm">Total Staff</p>
        </div>
        {roleStats.map((stat) => (
          <div key={stat.role} className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="text-neutral-800 mb-1">{stat.count}</h3>
            <p className="text-neutral-500 text-sm">{stat.role}s</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab("staff")}
          className={`px-6 py-3 rounded-2xl transition-all ${
            activeTab === "staff"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
              : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Users className="w-5 h-5 inline mr-2" />
          Staff List
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`px-6 py-3 rounded-2xl transition-all ${
            activeTab === "schedule"
              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
              : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          Shift Schedule
        </button>
      </div>

      {/* Staff List Tab */}
      {activeTab === "staff" && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-neutral-700">Name</th>
                  <th className="px-6 py-4 text-left text-neutral-700">Role</th>
                  <th className="px-6 py-4 text-left text-neutral-700">Phone</th>
                  <th className="px-6 py-4 text-left text-neutral-700">Email</th>
                  <th className="px-6 py-4 text-left text-neutral-700">Status</th>
                  <th className="px-6 py-4 text-left text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr key={staff.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                          {staff.name.charAt(0)}
                        </div>
                        <p className="text-neutral-800">{staff.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm ${getRoleBadgeColor(staff.role)}`}>
                        {staff.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-600">{staff.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-neutral-600">{staff.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-sm ${
                        staff.status === "Active" 
                          ? "bg-success/10 text-success" 
                          : "bg-neutral-100 text-neutral-600"
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-neutral-100 rounded-lg transition-all">
                          <Edit className="w-4 h-4 text-neutral-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4 text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left text-neutral-700 sticky left-0 bg-neutral-100">Staff</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Monday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Tuesday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Wednesday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Thursday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Friday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Saturday</th>
                  <th className="px-6 py-4 text-center text-neutral-700">Sunday</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.staffId} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="px-6 py-4 sticky left-0 bg-white">
                      <p className="text-neutral-800">{schedule.staffName}</p>
                    </td>
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                      const shift = schedule[day as keyof Shift] as string;
                      const isOff = shift === "OFF";
                      return (
                        <td key={day} className="px-6 py-4 text-center">
                          <span className={`px-3 py-2 rounded-lg text-sm inline-block ${
                            isOff 
                              ? "bg-neutral-100 text-neutral-500" 
                              : "bg-primary/10 text-primary"
                          }`}>
                            {shift}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-accent">Add Staff</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-all" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-neutral-500 text-sm font-bold mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-sm font-bold mb-2">Role</label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as "Admin" | "Cashier" | "Cook" | "Cleaner" | "Manager" })}
                  >
                    <option value="Admin">Admin</option>
                    <option value="Cashier">Cashier</option>
                    <option value="Cook">Cook</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-500 text-sm font-bold mb-2">Phone</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 text-sm font-bold mb-2">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary"
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value as "Active" | "Inactive" })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  onClick={handleAddStaff}
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}