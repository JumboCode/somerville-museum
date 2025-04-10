import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './CalendarPicker.css';

const CalendarPicker = forwardRef(({ onDateSelect, isOpen, onClose }, ref) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectionMode, setSelectionMode] = useState('start'); // 'start' or 'end'
  const calendarRef = useRef(null);
  const today = new Date(); // Get today's date

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Expose resetCalendar method via ref
  useImperativeHandle(ref, () => ({
    resetCalendar: () => {
      resetSelection();
      onDateSelect(null, null); // Clear the date filters in parent component
    }
  }));

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    if (selectionMode === 'start') {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
      setSelectionMode('end');
    } else {
      // Ensure start date comes before end date
      if (selectedStartDate && clickedDate < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(clickedDate);
      } else {
        setSelectedEndDate(clickedDate);
      }
      
      // Format dates in ISO format for consistent handling
      const startDate = selectedStartDate || clickedDate;
      const endDate = selectedStartDate && clickedDate > selectedStartDate ? clickedDate : selectedStartDate;
      
      // Format for display (MM/DD/YYYY)
      const formattedStartDate = startDate ? 
        `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}` : null;
      
      const formattedEndDate = endDate ?
        `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}` : null;
      
      // Only call onDateSelect when both dates are selected
      if (formattedStartDate && formattedEndDate) {
        onDateSelect(formattedStartDate, formattedEndDate);
        onClose();
      }
      
      setSelectionMode('start'); // Reset selection mode
    }
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation(); // Prevent event from bubbling
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const resetSelection = () => {
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSelectionMode('start');
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

  // Function to check if a day is today
  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  // Function to check if a day is within the selected range
  const isInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  // Function to check if a day is selected (start or end)
  const isSelected = (day) => {
    if (!selectedStartDate && !selectedEndDate) return false;
    
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    return (
      (selectedStartDate && 
       date.getDate() === selectedStartDate.getDate() && 
       date.getMonth() === selectedStartDate.getMonth() && 
       date.getFullYear() === selectedStartDate.getFullYear()) ||
      (selectedEndDate && 
       date.getDate() === selectedEndDate.getDate() && 
       date.getMonth() === selectedEndDate.getMonth() && 
       date.getFullYear() === selectedEndDate.getFullYear())
    );
  };

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
      
      <div className="selection-info">
        {selectedStartDate && (
          <div className="selected-date">
            Start: {`${selectedStartDate.getMonth() + 1}/${selectedStartDate.getDate()}/${selectedStartDate.getFullYear()}`}
          </div>
        )}
        {selectedEndDate && (
          <div className="selected-date">
            End: {`${selectedEndDate.getMonth() + 1}/${selectedEndDate.getDate()}/${selectedEndDate.getFullYear()}`}
          </div>
        )}
        {(selectedStartDate || selectedEndDate) && (
          <button 
            className="reset-button" 
            onClick={() => {
              resetSelection();
              onDateSelect(null, null); // Clear the date filters in parent component
            }}
          >
            Reset
          </button>
        )}
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
              className={`day 
                ${isSelected(day) ? 'selected' : ''} 
                ${isInRange(day) ? 'in-range' : ''}
                ${isToday(day) ? 'today' : ''}`}
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
});

CalendarPicker.displayName = 'CalendarPicker'; 

export default CalendarPicker;