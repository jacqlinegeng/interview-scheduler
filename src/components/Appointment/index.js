import React, { fragment } from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

export default function Appointment(props) {

  console.log("props", props)
  
  const CREATE = "CREATE";
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    console.log("changing mode to saving")
    transition(SAVING)

    props.bookInterview(props.id, interview)
    .then(() => {
      console.log("changing mode to show")
      transition(SHOW)
    });

  }

  function deleteInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(CONFIRM)

    transition(DELETING)

    props.cancelInterview(props.id, interview)
    .then(() => {
      transition(EMPTY)
    })
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)}/>}
      {mode === SHOW && <Show 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        />}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onSave={save} 
        onCancel={back}
        />}
      {mode === SAVING && <Status
        message="loading"
        />}
      {mode === CONFIRM && <Confirm
        message="are you sure you would like to delete?"
        onConfirm={deleteInterview}
      />}
      {mode === DELETING && <Status
        message="deleting"
      />}
    </article>
  )
}

