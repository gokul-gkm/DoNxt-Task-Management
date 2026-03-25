export function formatTimeRemaining(dueDateString: string | Date | undefined | null): { 
  text: string; 
  status: 'overdue' | 'due-soon' | 'normal' | 'no-date' 
} {
  if (!dueDateString) {
    return { text: "No date", status: 'no-date' };
  }

  const dueDate = new Date(dueDateString);
  const now = new Date();
  
  if (isNaN(dueDate.getTime())) {
     return { text: "No date", status: 'no-date' };
  }
  
  const dueDay = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    if (diffDays === -1) return { text: "Yesterday", status: 'overdue' };
    return { text: `${Math.abs(diffDays)}d overdue`, status: 'overdue' };
  }
  
  if (diffDays === 0) {
    return { text: "Today", status: 'due-soon' };
  }
  
  if (diffDays === 1) {
    return { text: "Tomorrow", status: 'due-soon' };
  }
  
  if (diffDays <= 3) {
    return { text: `In ${diffDays}d`, status: 'due-soon' };
  }
  
  if (diffDays <= 7) {
    return { text: `In ${diffDays}d`, status: 'normal' };
  }
  
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (dueDay.getFullYear() !== today.getFullYear()) {
    options.year = 'numeric';
  }
  
  return { text: dueDay.toLocaleDateString(undefined, options), status: 'normal' };
}

export function formatPreciseTimeRemaining(dueDateString: string | Date | undefined | null): { 
  text: string; 
  status: 'overdue' | 'due-soon' | 'normal' | 'no-date' 
} {
  if (!dueDateString) return { text: "No date", status: 'no-date' };

  const dueDate = new Date(dueDateString);
  const now = new Date();
  
  if (isNaN(dueDate.getTime())) return { text: "No date", status: 'no-date' };

  const diffMs = dueDate.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));

  let text = "";
  if (days > 0) {
    text = `${days}d ${hours}h`;
  } else if (hours > 0) {
    text = `${hours}h ${mins}m`;
  } else {
    text = `${mins}m`;
  }

  if (isOverdue) text = `${text} overdue`;

  let status: 'overdue' | 'due-soon' | 'normal' = 'normal';
  if (isOverdue) status = 'overdue';
  else if (days <= 2) status = 'due-soon';
  
  return { text, status };
}

