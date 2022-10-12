import React from "react";

export function getAppointmentsForDay(state, day) {
  const dayObj = state.days.find(d => d.name === day);
  if (dayObj === undefined || state.days.length === 0) {
    return [];
  }

  return dayObj.appointments.map(id => state.appointments[id]);
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  return {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  }
}

export function getInterviewersForDay(state, day) {
  const dayObj = state.days.find(d => d.name === day);
  if (dayObj === undefined || state.days.length === 0) {
    return [];
  }

  return dayObj.interviewers.map(id => state.interviewers[id]);
}
