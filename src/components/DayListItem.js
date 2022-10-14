import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";

function formatSpots(spots) {
  if (spots === 0) {
    return "no spots remaining";
  }

  return `${spots} ${spots === 1 ? 'spot' : 'spots'} remaining`;
}

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item', { 
    'day-list__item--selected': props.selected === true 
  }, { 
    'day-list__item--full': props.spots === 0
  })

  return (
    <li 
      data-testid="day"
      className={dayClass} 
      onClick={() => props.setDay(props.name)} 
      selected={props.selected} 
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
