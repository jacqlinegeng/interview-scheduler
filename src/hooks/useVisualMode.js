import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode) {
    setMode(mode)
    const newHistory = [...history]
    newHistory.push(mode)
    setHistory(newHistory)
  }

  function back() {

    const newHistory = [...history]
    if (newHistory.length > 1) {
      newHistory.pop()
      setHistory(newHistory)
      setMode(newHistory[newHistory.length - 1])
    }
  }

  function transition(mode, replace = false) {

    setHistory(prev => replace ? [...prev.slice(0, prev.length - 1), mode] : [...prev, mode]);
  }

  return { mode: history[history.length - 1], transition, back };
}