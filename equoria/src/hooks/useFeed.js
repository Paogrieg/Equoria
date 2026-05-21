import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../api/client";

export function useFeed() {
  const [news, setNews]                 = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [laws, setLaws]                 = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nRes, tRes, lRes] = await Promise.all([
        apiFetch("/new"),
        apiFetch("/testimonials"),
        apiFetch("/laws"),
      ]);
      setNews((nRes.data || []).map(n => ({ ...n, type: "news" })));
      setTestimonials((tRes.data || []).map(t => ({ ...t, type: "testimony" })));
      setLaws((lRes.data || []).map(l => ({ ...l, type: "law" })));
    } catch (e) {
      setError(e.message || "No se pudo conectar con la API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const feed = [];
  const maxLen = Math.max(news.length, testimonials.length, laws.length);
  for (let i = 0; i < maxLen; i++) {
    if (news[i])         feed.push(news[i]);
    if (testimonials[i]) feed.push(testimonials[i]);
    if (laws[i])         feed.push(laws[i]);
  }

  return { feed, news, testimonials, laws, loading, error, refetch: fetchAll };
}