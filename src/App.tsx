import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { TimetableWeekly } from './components/timetable/TimetableWeekly';
import { TodayScheduleView } from './components/today/TodayScheduleView';
import { SmartStudyPlanner } from './components/study/SmartStudyPlanner';
import { CodingTracker } from './components/coding/CodingTracker';
import { AssignmentManager } from './components/assignments/AssignmentManager';
import { NotesManager } from './components/notes/NotesManager';
import { ExamPlanner } from './components/exams/ExamPlanner';
import { ProjectTracker } from './components/projects/ProjectTracker';
import { ProductivityAnalytics } from './components/analytics/ProductivityAnalytics';
import { SettingsView } from './components/settings/SettingsView';

import { ClassModal } from './components/timetable/ClassModal';
import { WhatsAppModal } from './components/whatsapp/WhatsAppModal';
import { FocusModeModal } from './components/focus/FocusModeModal';
import { WelcomeModal } from './components/onboarding/WelcomeModal';
import { CommandPalette } from './components/common/CommandPalette';
import { ToastContainer } from './components/common/ToastContainer';
import { CalendarExportModal } from './components/calendar/CalendarExportModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'overview':
        return <OverviewDashboard />;
      case 'timetable':
        return <TimetableWeekly />;
      case 'today':
        return <TodayScheduleView />;
      case 'study':
        return <SmartStudyPlanner />;
      case 'coding':
        return <CodingTracker />;
      case 'assignments':
        return <AssignmentManager />;
      case 'notes':
        return <NotesManager />;
      case 'exams':
        return <ExamPlanner />;
      case 'projects':
        return <ProjectTracker />;
      case 'analytics':
        return <ProductivityAnalytics />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar />

      {/* Main App Body */}
      <div className="flex flex-1 overflow-hidden min-w-0">
        {/* Sidebar - Desktop */}
        <Sidebar />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav />

      {/* Global Modals & Overlays */}
      <ClassModal />
      <WhatsAppModal />
      <CalendarExportModal />
      <FocusModeModal />
      <WelcomeModal />
      <CommandPalette />
      <ToastContainer />
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
