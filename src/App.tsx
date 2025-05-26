import React, { useState, useEffect } from 'react';
import Todo from './components/todo';
import styles from './App.module.css';

interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;
}

const TaskForm: React.FC<{ addTask: (title: string, description?: string, dueDate?: string) => void }> = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [showDateInput, setShowDateInput] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title, description.trim() ? description : undefined, dueDate || undefined);
            setTitle('');
            setDescription('');
            setDueDate('');
            setShowDateInput(false);
        } else {
            setShowErrorModal(true);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nova tarefa"
                    maxLength={30}
                />
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descrição da tarefa"
                />
                {showDateInput && (
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        placeholder="Data de vencimento"
                    />
                )}
                <div className={styles.buttonContainer}>
                    <button type="button" className={styles.dataButton} onClick={() => setShowDateInput(!showDateInput)}>
                        {showDateInput ? 'Remover Data' : 'Adicionar Data'}
                    </button>
                    <button type="submit" className={styles.filterButton}>Criar Tarefa</button>
                </div>
            </form>
            {showErrorModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Aviso</h2>
                        <p>Adicione o título da tarefa.</p>
                        <button onClick={() => setShowErrorModal(false)}>Fechar</button>
                    </div>
                </div>
            )}
        </>
    );
};

const TaskList: React.FC<{ tasks: Task[]; viewTask: (id: number) => void }> = ({ tasks, viewTask }) => {
    return (
        <div className={styles.tasksBox}>
            {tasks.map((task) => (
                <Todo
                    key={task.id}
                    title={task.title}
                    completed={task.completed}
                    dueDate={task.dueDate}
                    onView={() => viewTask(task.id)}
                />
            ))}
        </div>
    );
};

const App: React.FC = () => {
    const [todos, setTodos] = useState<Task[]>(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });
    const [selectedTodo, setSelectedTodo] = useState<Task | null>(null);
    const [filter, setFilter] = useState<'ALL' | 'COMPLETED' | 'TODO'>('ALL');

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (title: string, description?: string, dueDate?: string) => {
        const newTodos = [
            ...todos,
            { id: todos.length + 1, title, description, completed: false, dueDate },
        ];
        setTodos(newTodos);
    };

    const toggleTodo = (id: number) => {
        const newTodos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(newTodos);
    };

    const removeTodo = (id: number) => {
        const newTodos = todos.filter(todo => todo.id !== id);
        setTodos(newTodos);
        closeTodo();
    };

    const viewTodo = (id: number) => {
        const todo = todos.find(todo => todo.id === id);
        setSelectedTodo(todo ? { ...todo } : null);
    };

    const closeTodo = () => {
        setSelectedTodo(null);
    };

    const completeTodo = () => {
        if (selectedTodo) {
            toggleTodo(selectedTodo.id);
            closeTodo();
        }
    };

    const filteredTodos = todos
    .filter(todo => {
        if (filter === 'COMPLETED') return todo.completed;
        if (filter === 'TODO') return !todo.completed;
        return true;
    })
    .sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });

    return (
        <div className={styles.App}>
            <div className={styles.container}>
                <div className={styles.taskContainer}>
                    <div className={styles.header}>
                        <img src="/tasks.png" alt="Logo" className={styles.logo} />
                        <h2>Gerenciador de Tarefas</h2>
                    </div>
                    <TaskForm addTask={addTodo} />
                    <div className={styles.filterButtons}>
                        <button
                            className={filter === 'ALL' ? styles.selected : ''}
                            onClick={() => setFilter('ALL')}
                            onMouseOver={() => console.log('TODAS')}
                            onFocus={() => console.log('TODAS')}
                        >
                            TODAS
                        </button>
                        <button
                            className={filter === 'COMPLETED' ? styles.selected : ''}
                            onClick={() => setFilter('COMPLETED')}
                            onMouseOver={() => console.log('CONCLUÍDAS')}
                            onFocus={() => console.log('CONCLUÍDAS')}
                        >
                            CONCLUÍDAS
                        </button>
                        <button
                            className={filter === 'TODO' ? styles.selected : ''}
                            onClick={() => setFilter('TODO')}
                            onMouseOver={() => console.log('A FAZER')}
                            onFocus={() => console.log('A FAZER')}
                        >
                            A FAZER
                        </button>
                    </div>
                    <TaskList tasks={filteredTodos} viewTask={viewTodo} />
                </div>
            </div>
            {selectedTodo && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>{selectedTodo.title}</h2>
                        {selectedTodo.dueDate && <p>Data: {new Date(selectedTodo.dueDate).toLocaleDateString()}</p>}
                        <p>{selectedTodo.description}</p>
                        <button onClick={completeTodo}>
                            {selectedTodo.completed ? 'A Concluir' : 'Marcar como Concluída'}
                        </button>
                        <button onClick={() => removeTodo(selectedTodo.id)}>Remover</button>
                        <button onClick={closeTodo}>Fechar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;