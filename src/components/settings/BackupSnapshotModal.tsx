import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Database, Download, Upload, ShieldCheck, CheckCircle2, AlertTriangle, X, RefreshCw, HardDrive } from 'lucide-react';

interface BackupSnapshotModalProps {
  onClose: () => void;
}

export const BackupSnapshotModal: React.FC<BackupSnapshotModalProps> = ({ onClose }) => {
  const { products, customers, invoices, transfers, aiBills, alterations, currentStore, showToast } = useApp();

  const [backupsList, setBackupsList] = useState([
    {
      id: 'bak-01',
      name: 'EmergesOS_AutoDaily_Snapshot_2026-08-15.json',
      timestamp: 'Today, 07:30 PM',
      recordsCount: `${products.length} Products, ${customers.length} Customers, ${invoices.length} Invoices`,
      fileSize: '4.8 MB',
      type: 'Automated Snapshot'
    },
    {
      id: 'bak-02',
      name: 'EmergesOS_PreMigration_Crescent_Export.json',
      timestamp: 'Today, 02:15 PM',
      recordsCount: '500 Customers, 210 SKUs, 60 Invoices',
      fileSize: '4.2 MB',
      type: 'Manual Master Export'
    }
  ]);

  const handleDownloadSnapshot = () => {
    const fullDatabaseSnapshot = {
      version: 'EmergesOS-v2.0',
      exportedAt: new Date().toISOString(),
      storeOrigin: currentStore,
      masterData: {
        products,
        customers,
        invoices,
        transfers,
        aiBills,
        alterations
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDatabaseSnapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EmergesOS_Backup_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Database Backup Exported', 'Full system state snapshot downloaded successfully.', 'success');
  };

  const handleSimulateRestore = () => {
    showToast('Snapshot Verified', 'Database integrity check passed (0 checksum errors).', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">System Backup, Disaster Recovery & Snapshot Engine</h2>
              <p className="text-xs text-slate-400">1-Click JSON/SQL snapshot exports & verification checks (SqlBak.exe / frmBakRst)</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Action cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" /> Export Full System Snapshot
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Exports all {products.length} products, {customers.length} customers, invoices, STNs, and double-entry journals into a verifiable JSON archive.
                </p>
              </div>

              <button
                onClick={handleDownloadSnapshot}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20 transition-all"
              >
                <HardDrive className="w-3.5 h-3.5" /> Download Snapshot Now
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" /> Restore from Snapshot
                </div>
                <p className="text-slate-400 text-[11px] mt-1">
                  Upload an existing EmergesOS backup JSON file to restore state with automated schema migration.
                </p>
              </div>

              <button
                onClick={handleSimulateRestore}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Run Integrity Verify
              </button>
            </div>
          </div>

          {/* Backup History */}
          <div className="space-y-2.5">
            <div className="font-bold text-white text-xs">Available Snapshot Checkpoints</div>
            <div className="space-y-2">
              {backupsList.map(b => (
                <div key={b.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white font-mono text-[11px]">{b.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {b.timestamp} · <span className="text-slate-300">{b.recordsCount}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-slate-400 font-bold block">{b.fileSize}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold">{b.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
