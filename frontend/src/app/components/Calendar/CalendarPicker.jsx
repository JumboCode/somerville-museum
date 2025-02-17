import React, { useState, useRef, useEffect } from 'react';
import './CalendarPicker.css';

const CalendarPicker = ({ onDateSelect, isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const calendarRef = useRef(null);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    const formattedDate = `${currentDate.getMonth() + 1}/${day}/${currentDate.getFullYear()}`;
    onDateSelect(formattedDate);
    onClose();
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside both the calendar and the calendar icon
      if (calendarRef.current && !calendarRef.current.contains(event.target) && 
          !event.target.closest('.calendar-icon')) {
        onClose();
      }
    };

    // Add the event listener to document
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Only re-run if onClose changes

  if (!isOpen) return null;

  // Get current month's days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get previous month's trailing days
  const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  const trailingDays = Array.from({ length: firstDayOfMonth }, (_, i) => prevMonthDays - i).reverse();

  // Get next month's leading days
  const totalDaysDisplayed = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const leadingDays = Array.from({ length: totalDaysDisplayed - (firstDayOfMonth + daysInMonth) }, (_, i) => i + 1);

  return (
    <div 
      ref={calendarRef} 
      className="calendar-picker"
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside calendar from bubbling
    >
      <div className="calendar-arrow"></div>
      <div className="calendar-header">
        <button className="month-nav prev" onClick={handlePrevMonth}>&lt;</button>
        <span className="current-month">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
        <button className="month-nav next" onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-body">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="days-grid">
          {trailingDays.map((day, index) => (
            <div key={`prev-${day}`} className="day disabled">{day}</div>
          ))}
          
          {days.map(day => (
            <div
              key={`current-${day}`}
              className={`day ${
                selectedDate && 
                selectedDate.getDate() === day && 
                selectedDate.getMonth() === currentDate.getMonth() && 
                selectedDate.getFullYear() === currentDate.getFullYear()
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleDateClick(day)}
            >
              {day}
            </div>
          ))}
          
          {leadingDays.map(day => (
            <div key={`next-${day}`} className="day disabled">{day}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarPicker;