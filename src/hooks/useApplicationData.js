import React, { useState, useEffect } from "react";
import "components/Application.scss";
import "components/Appointment";
import axios from "axios";

export default function useApplicationData() {

  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

   const getSpotsForDays = function (day, appointments) {
    let spots = 0;
    for (const id of day.appointments) {
      const appointment = appointments[id];
      if (!appointment.interview) {
        spots+=1;
      }
    }

    return spots;
  };
  //after getting spots, updates the spots with the remaining spots
  const updateSpots = function (state, appointments, id) {
    const dayObj = state.days.find((day) => day.name === state.day);

    const spots = getSpotsForDays(dayObj, appointments);

    const day = { ...dayObj, spots };

    return state.days.map((d) => (d.name === state.day ? day : d));
  };

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
        appointments,
        days: updateSpots(state, appointments)
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

      setState({
        ...state,
        days: updateSpots(state, appointments),
        appointments
      })
    });
  }

  useEffect(() => {
    Promise.all([
      axios.get(`api/days`),
      axios.get(`api/appointments`),
      axios.get(`api/interviewers`),
      // axios.get(`/api/debug/reset`)
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    })
  }, []);

  return {
    state, 
    setDay, 
    bookInterview, 
    cancelInterview
  };
}