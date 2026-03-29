import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: memberships, error } = await supabase
        .from('organization_members')
        .select('*, organizations(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      const orgs = memberships?.map(m => ({
        ...m.organizations,
        role: m.role
      })) || [];

      setOrganizations(orgs);
      
      // Select first org as default if none selected or if selected not in list
      if (orgs.length > 0) {
        const savedOrgId = localStorage.getItem('autotracker_org_id');
        const defaultOrg = orgs.find(o => o.id === savedOrgId) || orgs[0];
        setCurrentOrg(defaultOrg);
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectOrg = (org) => {
    setCurrentOrg(org);
    if (org) {
      localStorage.setItem('autotracker_org_id', org.id);
    } else {
      localStorage.removeItem('autotracker_org_id');
    }
  };

  return (
    <OrganizationContext.Provider value={{ organizations, currentOrg, selectOrg, loading, refresh: fetchOrgs }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
