import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VisitorRecord {
  id: string;
  visited_at: string;
  user_agent: string | null;
  session_id: string | null;
  visitor_name: string | null;
}

export const useVisitorAnalytics = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [recentVisits, setRecentVisits] = useState<VisitorRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trackVisit = useCallback(async (visitorName?: string) => {
    try {
      const sessionId = sessionStorage.getItem("visitor_session_id") || crypto.randomUUID();
      sessionStorage.setItem("visitor_session_id", sessionId);

      await supabase.from("visitor_analytics").insert({
        user_agent: navigator.userAgent,
        session_id: sessionId,
        visitor_name: visitorName || null,
      });
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const { count } = await supabase
        .from("visitor_analytics")
        .select("*", { count: "exact", head: true });

      const { data } = await supabase
        .from("visitor_analytics")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(50);

      setTotalVisitors(count || 0);
      setRecentVisits(data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { totalVisitors, recentVisits, isLoading, fetchAnalytics, trackVisit };
};
