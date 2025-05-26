import React from 'react';
import styles from './todo.module.css';

interface TodoProps {
    title: string;
    completed: boolean;
    dueDate?: string;
    onView: () => void;
}

const Todo: React.FC<TodoProps> = ({ title, completed, dueDate, onView }) => {
    return (
        <div className={`${styles.todo} ${completed ? styles.completed : ''}`}>
            <p className={completed ? styles.completed : ''}>{title}</p>
            <div className={styles.actions}>
                {dueDate && <span className={styles.dueDate}>{new Date(dueDate).toLocaleDateString()}</span>}
                <button onClick={onView}>Ver</button>
            </div>
        </div>
    );
};

export default Todo;