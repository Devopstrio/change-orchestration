import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, PlayCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Platform Overview</h1>
          <p className="text-slate-400 mt-1">Live status of active changes and operational health.</p>
        </div>
        <button className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-sky-900/20">
          Sync Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatusCard title="Approved" count={12} icon={<CheckCircle2 className="text-emerald-400" />} />
        <StatusCard title="Pending" count={4} icon={<Clock className="text-sky-400" />} />
        <StatusCard title="Critical" count={1} icon={<AlertTriangle className="text-amber-400" />} />
        <StatusCard title="In Progress" count={3} icon={<PlayCircle className="text-purple-400" />} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-semibold">Recent Change Requests</h2>
          <span className="text-xs text-sky-400 font-mono uppercase tracking-wider">Live Feed</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-sm border-b border-slate-800">
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Change Title</th>
              <th className="px-6 py-4 font-medium">Environment</th>
              <th className="px-6 py-4 font-medium">Risk</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <TableRow id="CR-9012" title="EKS Cluster Upgrade (v1.28)" env="Production" risk="High" status="Approved" statusColor="bg-emerald-500/10 text-emerald-400" />
            <TableRow id="CR-9013" title="DB Migration: User Metadata" env="Staging" risk="Medium" status="Pending" statusColor="bg-sky-500/10 text-sky-400" />
            <TableRow id="CR-9014" title="Emergency: Patch Security CVE" env="Production" risk="Critical" status="Deploying" statusColor="bg-purple-500/10 text-purple-400" />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusCard = ({ title, count, icon }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-slate-950 rounded-xl">{icon}</div>
      <div>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
    </div>
  </div>
);

const TableRow = ({ id, title, env, risk, status, statusColor }: any) => (
  <tr className="hover:bg-slate-800/30 transition">
    <td className="px-6 py-4 font-mono text-xs text-slate-500">{id}</td>
    <td className="px-6 py-4 font-medium text-slate-200">{title}</td>
    <td className="px-6 py-4 text-slate-400">{env}</td>
    <td className="px-6 py-4 text-slate-400">{risk}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
    </td>
  </tr>
);

export default Dashboard;
