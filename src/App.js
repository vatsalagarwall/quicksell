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
        <span className="display-icon">☰</span>
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