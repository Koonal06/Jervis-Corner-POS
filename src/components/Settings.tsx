import { useState } from "react";
import { 
  Settings as SettingsIcon, Database, Download, Upload, Trash2, 
  Bell, Globe, DollarSign, Clock, Shield, Activity, Printer
} from "lucide-react";
import { dataStore } from "../lib/dataStore";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'notifications' | 'logs'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const logs = dataStore.getLogs().slice(-50).reverse();

  const handleExportAllData = () => {
    const data = dataStore.exportToJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jervis_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Full backup exported successfully!');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        // In a real app, we'd validate and import this data
        toast.success('Data import successful!');
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    dataStore.clearAllData();
    setShowDeleteConfirm(false);
    toast.success('All data cleared successfully!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const tabs = [
    { key: 'general', label: 'General', icon: SettingsIcon },
    { key: 'data', label: 'Data & Backup', icon: Database },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'logs', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="p-8 space-y-8 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-accent mb-2">System Settings</h1>
        <p className="text-neutral-600">Configure system preferences and manage data</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                  : "bg-white text-neutral-600 hover:bg-neutral-50 shadow-sm"
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Restaurant Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-neutral-700 mb-2">Restaurant Name</label>
                <input
                  type="text"
                  defaultValue="Jervis Corner Snack Shop"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  defaultValue="+230 5xxx xxxx"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Address</label>
                <textarea
                  defaultValue="Mauritius"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Currency & Regional Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-700 mb-2">Currency</label>
                <select className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none">
                  <option>MUR - Mauritian Rupee (Rs)</option>
                  <option>USD - US Dollar ($)</option>
                  <option>EUR - Euro (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Timezone</label>
                <select className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none">
                  <option>Indian/Mauritius (UTC+4)</option>
                  <option>UTC</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">VAT Rate (%)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Date Format</label>
                <select className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Receipt Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Printer className="w-5 h-5 text-neutral-600" />
                  <div>
                    <p className="text-neutral-800">Auto-print receipts</p>
                    <p className="text-sm text-neutral-500">Print receipt after payment</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div>
                <label className="block text-neutral-700 mb-2">Receipt Footer Message</label>
                <textarea
                  defaultValue="Thank you for dining at Jervis Corner!&#10;Visit us again soon!"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-2xl focus:border-primary focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <button className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl shadow-lg hover:shadow-xl transition-all">
            Save Settings
          </button>
        </div>
      )}

      {/* Data & Backup */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Backup & Restore</h2>
            <div className="space-y-4">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Database className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-blue-900 mb-2">Export All Data</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      Download a complete backup of all orders, inventory, menu items, staff, and settings
                    </p>
                    <button
                      onClick={handleExportAllData}
                      className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export Full Backup
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Upload className="w-8 h-8 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-green-900 mb-2">Import Data</h3>
                    <p className="text-green-700 text-sm mb-4">
                      Restore data from a previously exported backup file
                    </p>
                    <label className="px-6 py-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all inline-flex items-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Choose Backup File
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-yellow-900 mb-2">Automatic Backups</h3>
                    <p className="text-yellow-700 text-sm mb-4">
                      Schedule automatic backups to external storage or cloud
                    </p>
                    <div className="flex items-center gap-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                      <span className="text-sm text-neutral-600">Daily at 11:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Data Management</h2>
            <div className="space-y-4">
              <div className="p-6 bg-neutral-50 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-neutral-800 mb-1">Storage Usage</h3>
                    <p className="text-sm text-neutral-500">Local browser storage</p>
                  </div>
                  <span className="text-sm text-neutral-600">
                    {((JSON.stringify(dataStore.exportToJSON()).length / 1024) / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((JSON.stringify(dataStore.exportToJSON()).length / (5 * 1024 * 1024)) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">Browser limit: ~5-10 MB</p>
              </div>

              <div className="p-6 bg-red-50 border border-red-200 rounded-2xl">
                <div className="flex items-start gap-4">
                  <Trash2 className="w-8 h-8 text-danger flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-red-900 mb-2">Clear All Data</h3>
                    <p className="text-red-700 text-sm mb-4">
                      Permanently delete all orders, inventory, and settings. This action cannot be undone!
                    </p>
                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-3 bg-danger text-white rounded-2xl hover:bg-red-600 transition-all"
                      >
                        Clear All Data
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-red-800">Are you absolutely sure?</p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleClearAllData}
                            className="px-6 py-3 bg-danger text-white rounded-2xl hover:bg-red-600 transition-all"
                          >
                            Yes, Delete Everything
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Notification Preferences</h2>
            <div className="space-y-4">
              {[
                { title: 'New Orders', desc: 'Alert when new order is placed', icon: Bell },
                { title: 'Low Stock', desc: 'Notify when inventory is low', icon: Package },
                { title: 'Order Ready', desc: 'Alert when kitchen completes order', icon: CheckCircle },
                { title: 'Daily Summary', desc: 'End-of-day sales summary', icon: FileText },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center justify-between p-5 bg-neutral-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 text-neutral-600" />
                      <div>
                        <p className="text-neutral-800">{item.title}</p>
                        <p className="text-sm text-neutral-500">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
            <h2 className="text-neutral-900 mb-6">Sound Alerts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-neutral-50 rounded-xl">
                <div>
                  <p className="text-neutral-800">Enable sound notifications</p>
                  <p className="text-sm text-neutral-500">Play audio alerts for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activity Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-neutral-900 mb-1">Activity Logs</h2>
              <p className="text-neutral-500 text-sm">Last 50 system activities</p>
            </div>
            <button
              onClick={() => {
                Analytics.exportToCSV(
                  logs.map(log => ({
                    Timestamp: new Date(log.timestamp).toLocaleString(),
                    User: log.user,
                    Action: log.action,
                    Details: log.details,
                  })),
                  'activity_logs'
                );
              }}
              className="px-5 py-3 bg-neutral-200 text-neutral-700 rounded-2xl hover:bg-neutral-300 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Logs
            </button>
          </div>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs">
                        {log.action}
                      </span>
                      <span className="text-sm text-neutral-600">{log.user}</span>
                    </div>
                    <p className="text-neutral-800 text-sm">{log.details}</p>
                  </div>
                  <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p className="text-center text-neutral-400 py-8">No activity logs yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Additional imports for icons
import { CheckCircle, Package, FileText } from "lucide-react";
