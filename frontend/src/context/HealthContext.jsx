import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const HealthContext = createContext();

export const HealthProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // 'self' or dependent object
  const [activeDependentId, setActiveDependentId] = useState('self');
  const [dependents, setDependents] = useState([]);
  const [reports, setReports] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Load initial health data when authenticated or active dependent changes
  const refreshData = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const depQuery = activeDependentId === 'self' ? {} : { dependentId: activeDependentId };

      const [depsRes, repRes, medRes, schedRes, timeRes] = await Promise.all([
        api.dependents.getAll().catch(() => ({ dependents: [] })),
        api.reports.getAll(depQuery).catch(() => ({ reports: [] })),
        api.medicines.getAll(depQuery).catch(() => ({ medicines: [] })),
        api.medicines.getTodaySchedule(depQuery).catch(() => ({ schedule: [] })),
        api.timeline.getAll(depQuery).catch(() => ({ events: [] }))
      ]);

      if (depsRes.dependents) setDependents(depsRes.dependents);
      if (repRes.reports) setReports(repRes.reports);
      if (medRes.medicines) setMedicines(medRes.medicines);
      if (schedRes.schedule) setTodaySchedule(schedRes.schedule);
      if (timeRes.events) setTimeline(timeRes.events);
    } catch (err) {
      console.error('Error loading health data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setReports([]);
      setMedicines([]);
      setTodaySchedule([]);
      setTimeline([]);
      setDependents([]);
    }
  }, [isAuthenticated, activeDependentId]);

  // Derived Statistics
  const activeMedicinesCount = medicines.filter(m => m.status === 'active').length;
  
  // Calculate total missed doses across medicines
  let totalMissedDoses = 0;
  medicines.forEach(m => {
    (m.doseLogs || []).forEach(log => {
      if (log.status === 'missed') totalMissedDoses++;
    });
  });

  const activeDependent = activeDependentId === 'self' 
    ? null 
    : dependents.find(d => d._id === activeDependentId);

  return (
    <HealthContext.Provider
      value={{
        activeDependentId,
        setActiveDependentId,
        activeDependent,
        dependents,
        reports,
        medicines,
        todaySchedule,
        timeline,
        loading,
        refreshData,
        isUploadModalOpen,
        setIsUploadModalOpen,
        stats: {
          totalReports: reports.length,
          activeMedicines: activeMedicinesCount,
          totalMissedDoses,
          dependentsCount: dependents.length
        }
      }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
