// src/hooks/usePlantSearch.js
import { useState, useMemo } from 'react';

export const usePlantSearch = (plants = []) => {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState(null);
  const [sunFilter, setSunFilter] = useState(null);
  const [diffFilter, setDiffFilter] = useState(null);

  const filtered = useMemo(() => {
    return plants.filter(p => {
      const q = query.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || (p.nickname || '').toLowerCase().includes(q);
      const matchType = !typeFilter || p.type === typeFilter;
      const matchSun = !sunFilter || p.sunlight === sunFilter;
      const matchDiff = !diffFilter || p.difficulty === diffFilter;
      return matchQ && matchType && matchSun && matchDiff;
    });
  }, [plants, query, typeFilter, sunFilter, diffFilter]);

  return {
    query, setQuery,
    typeFilter, setTypeFilter,
    sunFilter, setSunFilter,
    diffFilter, setDiffFilter,
    filtered,
  };
};