// App.js
import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Card Component
const Card = ({ ticket, user }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 4: return '🔴'; // Urgent
      case 3: return '🔺'; // High
      case 2: return '🔸'; // Medium
      case 1: return '🔹'; // Low
      default: return '⚪'; // No priority
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="ticket-id">{ticket.id}</span>
        <div className="user-avatar">
          {user?.name?.charAt(0)}
          <span className={`status-indicator ${user?.available ? 'available' : 'away'}`}></span>
        </div>
      </div>
      <div className="card-title">
        <span className="priority-icon">{getPriorityIcon(ticket.priority)}</span>
        {ticket.title}
      </div>
      <div className="card-tags">
        <span className="feature-tag">
          {ticket.tag}
        </span>
      </div>
    </div>
  );
};

// Column Component
const Column = ({ title, tickets, users }) => {
  const getIcon = () => {
    switch (title.toLowerCase()) {
      case 'backlog': return '📋';
      case 'todo': return '📝';
      case 'in progress': return '🔄';
      case 'done': return '✅';
      case 'canceled': return '❌';
      default: return '📎';
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-header-left">
          <span className="column-icon">{getIcon()}</span>
          <h3>{title}</h3>
          <span className="ticket-count">{tickets.length}</span>
        </div>
        <div className="column-actions">
          <button className="icon-button">+</button>
          <button className="icon-button">⋮</button>
        </div>
      </div>
      <div className="column-content">
        {tickets.map(ticket => (
          <Card
            key={ticket.id}
            ticket={ticket}
            user={users.find(u => u.id === ticket.userId)}
          />
        ))}
      </div>
    </div>
  );
};

// Header Component
const Header = ({ grouping, sorting, onGroupingChange, onSortingChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="header">
      <div className="display-button" onClick={() => setIsOpen(!isOpen)}>
        <span className="display-icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 10.5C9.63261 10.5 9.75979 10.5527 9.85355 10.6464C9.94732 10.7402 10 10.8674 10 11V14C10 14.1326 9.94732 14.2598 9.85355 14.3536C9.75979 14.4473 9.63261 14.5 9.5 14.5H8.5C8.36739 14.5 8.24021 14.4473 8.14645 14.3536C8.05268 14.2598 8 14.1326 8 14V11C8 10.8674 8.05268 10.7402 8.14645 10.6464C8.24021 10.5527 8.36739 10.5 8.5 10.5H9.5ZM7 11.5V13H1.75C1.55109 13 1.36032 12.921 1.21967 12.7803C1.07902 12.6397 1 12.4489 1 12.25C1 12.0511 1.07902 11.8603 1.21967 11.7197C1.36032 11.579 1.55109 11.5 1.75 11.5H7ZM14.25 11.5C14.4489 11.5 14.6397 11.579 14.7803 11.7197C14.921 11.8603 15 12.0511 15 12.25C15 12.4489 14.921 12.6397 14.7803 12.7803C14.6397 12.921 14.4489 13 14.25 13H11V11.5H14.25ZM5.5 6C5.63261 6 5.75979 6.05268 5.85355 6.14645C5.94732 6.24021 6 6.36739 6 6.5V9.5C6 9.63261 5.94732 9.75979 5.85355 9.85355C5.75979 9.94732 5.63261 10 5.5 10H4.5C4.36739 10 4.24021 9.94732 4.14645 9.85355C4.05268 9.75979 4 9.63261 4 9.5V6.5C4 6.36739 4.05268 6.24021 4.14645 6.14645C4.24021 6.05268 4.36739 6 4.5 6H5.5ZM3 7.25V8.75H1.75C1.55109 8.75 1.36032 8.67098 1.21967 8.53033C1.07902 8.38968 1 8.19891 1 8C1 7.80109 1.07902 7.61032 1.21967 7.46967C1.36032 7.32902 1.55109 7.25 1.75 7.25H3ZM14.25 7.25C14.4489 7.25 14.6397 7.32902 14.7803 7.46967C14.921 7.61032 15 7.80109 15 8C15 8.19891 14.921 8.38968 14.7803 8.53033C14.6397 8.67098 14.4489 8.75 14.25 8.75H7V7.25H14.25ZM11.5 1.75C11.6326 1.75 11.7598 1.80268 11.8536 1.89645C11.9473 1.99021 12 2.11739 12 2.25V5.25C12 5.38261 11.9473 5.50979 11.8536 5.60355C11.7598 5.69732 11.6326 5.75 11.5 5.75H10.5C10.3674 5.75 10.2402 5.69732 10.1464 5.60355C10.0527 5.50979 10 5.38261 10 5.25V2.25C10 2.11739 10.0527 1.99021 10.1464 1.89645C10.2402 1.80268 10.3674 1.75 10.5 1.75H11.5ZM9 3V4.5H1.75C1.55109 4.5 1.36032 4.42098 1.21967 4.28033C1.07902 4.13968 1 3.94891 1 3.75C1 3.55109 1.07902 3.36032 1.21967 3.21967C1.36032 3.07902 1.55109 3 1.75 3H9ZM14.25 3C14.4489 3 14.6397 3.07902 14.7803 3.21967C14.921 3.36032 15 3.55109 15 3.75C15 3.94891 14.921 4.13968 14.7803 4.28033C14.6397 4.42098 14.4489 4.5 14.25 4.5H13V3H14.25Z" fill="#5C5C5E" />
        </svg>
        </span>
        <span>Display</span>
        <span className="dropdown-icon">▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item">
            <span>Grouping</span>
            <select
              value={grouping}
              onChange={(e) => onGroupingChange(e.target.value)}
            >
              <option value="status">Status</option>
              <option value="user">User</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="dropdown-item">
            <span>Ordering</span>
            <select
              value={sorting}
              onChange={(e) => onSortingChange(e.target.value)}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

// Board Component
const Board = ({ tickets, users, grouping, sorting }) => {
  const getPriorityName = (priority) => {
    switch (priority) {
      case 4: return "Urgent";
      case 3: return "High";
      case 2: return "Medium";
      case 1: return "Low";
      default: return "No priority";
    }
  };

  const groupedTickets = useMemo(() => {
    let groups = {};

    switch (grouping) {
      case 'status':
        tickets.forEach(ticket => {
          if (!groups[ticket.status]) groups[ticket.status] = [];
          groups[ticket.status].push(ticket);
        });
        break;

      case 'user':
        tickets.forEach(ticket => {
          const user = users.find(u => u.id === ticket.userId);
          const userName = user ? user.name : 'Unassigned';
          if (!groups[userName]) groups[userName] = [];
          groups[userName].push(ticket);
        });
        break;

      case 'priority':
        const priorityOrder = {
          'Urgent': 4,
          'High': 3,
          'Medium': 2,
          'Low': 1,
          'No priority': 0
        };

        tickets.forEach(ticket => {
          const priorityName = getPriorityName(ticket.priority);
          if (!groups[priorityName]) groups[priorityName] = [];
          groups[priorityName].push(ticket);
        });

        // Sort the groups by priority
        const sortedGroups = {};
        Object.keys(groups)
          .sort((a, b) => priorityOrder[b] - priorityOrder[a])
          .forEach(key => {
            sortedGroups[key] = groups[key];
          });
        groups = sortedGroups;
        break;

      default:
        break;
    }

    // Sort tickets within each group
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        if (sorting === 'priority') {
          return b.priority - a.priority;
        } else {
          return a.title.localeCompare(b.title);
        }
      });
    });

    return groups;
  }, [tickets, users, grouping, sorting]);

  return (
    <div className="board">
      {Object.entries(groupedTickets).map(([groupName, tickets]) => (
        <Column
          key={groupName}
          title={groupName}
          tickets={tickets}
          users={users}
        />
      ))}
    </div>
  );
};

// Main App Component
function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'status');
  const [sorting, setSorting] = useState(localStorage.getItem('sorting') || 'priority');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
      const data = await response.json();
      setTickets(data.tickets);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleGroupingChange = (value) => {
    setGrouping(value);
    localStorage.setItem('grouping', value);
  };

  const handleSortingChange = (value) => {
    setSorting(value);
    localStorage.setItem('sorting', value);
  };

  return (
    <div className="app">
      <Header
        grouping={grouping}
        sorting={sorting}
        onGroupingChange={handleGroupingChange}
        onSortingChange={handleSortingChange}
      />
      <Board
        tickets={tickets}
        users={users}
        grouping={grouping}
        sorting={sorting}
      />
    </div>
  );
}

export default App;