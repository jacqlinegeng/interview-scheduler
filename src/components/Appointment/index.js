import React, { fragment } from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  
  const CREATE = "CREATE";
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)

    props
    .bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW)})
    .catch(error => transition(ERROR_SAVE, true));

  }

  function editInterview(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(EDIT)
  }


  function deleteInterview() {
      transition(DELETING, true);
      props
       .cancelInterview(props.id)
       .then(() => transition(EMPTY))
       .catch(error => transition(ERROR_DELETE, true));
  }

  
  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={()=>transition(CREATE)}/>}
      {mode === SHOW && <Show 
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={editInterview}
        />}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onSave={save} 
        onCancel={back}
        />}
      {mode === EDIT && <Form
        interviewers={props.interviewers}
        onSave={save} 
        onCancel={back}
        />}
      {mode === SAVING && <Status
        message="loading"
        />}
      {mode === ERROR_SAVE && <Error
        message="Error saving"
        onClose={back}
        />}
      {mode === ERROR_DELETE && <Error
        message="Error deleting"
        onClose={back}
        />}
      {mode === CONFIRM && <Confirm
        message="are you sure you would like to delete?"
        onConfirm={deleteInterview}
        onCancel={back}
      />}
      {mode === DELETING && <Status
        message="deleting"
      />}
    </article>
  )
}

