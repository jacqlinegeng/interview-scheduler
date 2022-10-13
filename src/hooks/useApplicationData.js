import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {

  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios.delete(`/api/appointments/${id}`)
    .then(() => {
      setState({
        ...state,
        appointments
      })
    })
  }

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
    
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(() => {

      const currentDay = state.day
      const newDays = state.days.map(day => {
        if (currentDay === day.name) {
          return {...day, spots : day.spots - 1 }
        }
        return day
      })

      setState({
        ...state,
        days: newDays,
        appointments
      })
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
      // axios.get(`/api/debug/reset`)
    ]).then((all) => {
      console.log("all", all[0].data)
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  return {
    state, 
    setDay, 
    bookInterview, 
    cancelInterview};
}