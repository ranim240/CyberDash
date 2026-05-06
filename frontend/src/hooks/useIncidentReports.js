// hooks/useIncidentReports.js
import { useEffect, useState } from "react";
import {
  createIncidentReport,
  getIncidentReports
} from "../api/incidentReportService";

export default function useIncidentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports on mount
  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getIncidentReports();
      const reportsData = Array.isArray(res.data.data) ? res.data.data : [];
      setReports(reportsData);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError(err.response?.data?.message || "Failed to load reports. Please try again.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Submit a new report
  const submitReport = async (reportData) => {
    try {
      const res = await createIncidentReport(reportData);
      
      // Add new report to the list
      if (res.data.success && res.data.data) {
        setReports(prev => [res.data.data, ...prev]);
      }

      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.[0] || 
                          err.response?.data?.message ||
                          "Failed to submit report. Please try again.";
      throw new Error(errorMessage);
    }
  };

  return {
    reports,
    loading,
    error,
    submitReport,
    refetch: fetchReports
  };
}
