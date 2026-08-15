import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PosTerminal } from './components/pos/PosTerminal';
import { StandalonePosHeader } from './components/pos/StandalonePosHeader';
import { PosLockModal } from './components/pos/PosLockModal';
import { InventoryHub } from './components/inventory/InventoryHub';
import { ApprovalsHub } from './components/approvals/ApprovalsHub';
import { PurchasesHub } from './components/purchases/PurchasesHub';
import { TransfersHub } from './components/transfers/TransfersHub';
import { AIStudioHub } from './components/aistudio/AIStudioHub';
import { ReportsHub } from './components/reports/ReportsHub';
import { AccountsHub } from './components/accounts/AccountsHub';
import { CrmHub } from './components/crm/CrmHub';
import { SchemesHub } from './components/schemes/SchemesHub';
import { CommandPalette } from './components/CommandPalette';
import { ToastContainer } from './components/Toast';
import { ShiftEndModal } from './components/pos/ShiftEndModal';

const MainLayout: React.FC = () => {
  const { activeTab, isStandalonePosMode, cashierName } = useApp();
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // If in Dedicated Standalone POS Terminal Mode
  if (isStandalonePosMode) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#030712] text-slate-100 font-sans">
        {/* Dedicated Standalone POS Kiosk Header */}
        <StandalonePosHeader 
          onOpenShiftModal={() => setShiftModalOpen(true)}
          onLockTerminal={() => setIsLocked(true)}
        />

        {/* Full-Width POS Terminal Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#030712] relative">
          <PosTerminal />
        </main>

        {/* Universal Command Palette (Ctrl+K) */}
        <CommandPalette />

        {/* Floating System Toasts */}
        <ToastContainer />

        {/* Shift End Modal */}
        {shiftModalOpen && (
          <ShiftEndModal onClose={() => setShiftModalOpen(false)} />
        )}

        {/* Lock Screen Security */}
        {isLocked && (
          <PosLockModal 
            cashierName={cashierName} 
            onUnlock={() => setIsLocked(false)} 
          />
        )}
      </div>
    );
  }

  // Full Enterprise ERP Suite Mode
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#030712] text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <Navbar onOpenShiftModal={() => setShiftModalOpen(true)} />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Dynamic Operational Content View */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#030712] relative">
          {activeTab === 'pos' && <PosTerminal />}
          {activeTab === 'inventory' && <InventoryHub />}
          {activeTab === 'approvals' && <ApprovalsHub />}
          {activeTab === 'purchases' && <PurchasesHub />}
          {activeTab === 'transfers' && <TransfersHub />}
          {activeTab === 'aistudio' && <AIStudioHub />}
          {activeTab === 'reports' && <ReportsHub />}
          {activeTab === 'accounts' && <AccountsHub />}
          {activeTab === 'crm' && <CrmHub />}
          {activeTab === 'schemes' && <SchemesHub />}
        </main>
      </div>

      {/* Universal Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Floating System Toasts */}
      <ToastContainer />

      {/* Shift End Modal */}
      {shiftModalOpen && (
        <ShiftEndModal onClose={() => setShiftModalOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
