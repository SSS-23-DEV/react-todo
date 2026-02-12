import {
    useState,
    useCallback,
    useRef,
    useMemo,
    useEffect,
    useReducer,
} from "react";
import tasksApi from "@/shared/api/tasks/index.js";

const tasksReducer = (state, action) => {
    switch (action.type){
        case 'SET_ALL': {
            return Array.isArray(action.tasks) ? action.tasks : state;
        }
        case 'ADD': {
            return [...state, action.task];
        }
        case 'TOGGLE_COMPLETE': {
            const { id, isDone } = action;

            return state.map((task) => {
                return task.id === id ? {...task, isDone} : task;
            })
        }
        case 'DELETE': {
            return state.filter((task) => task.id !== action.id)
        }
        case 'DELETE_ALL': {
            return [];
        }
        default: {
            return state;
        }
    }
}

const useTasks = () => {
    const [tasks, dispatch] = useReducer(tasksReducer, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [disapearingTaskId, setDisapearingTaskId] = useState(null);
    const [appearingTaskId, setAppearingTaskId] = useState(null);

    const newTaskInputRef = useRef(null);

    const deleteAllTasks = useCallback(() => {
        const isConfirmed = confirm('Are you sure you want to delete all ?');

        if (isConfirmed) {
            tasksApi.deleteAll(tasks).then(()=> dispatch({type: 'DELETE_ALL'}));
        }
    }, [tasks]);

    const deleteTask = useCallback((taskId) => {
        tasksApi.delete(taskId)
        .then(()=>{
            setDisapearingTaskId(taskId)
            setTimeout(()=> {dispatch({ type: 'DELETE', id: taskId })
            setDisapearingTaskId(null)
            }, 400)
        })
    }, []);

    const toggleTaskComplete = useCallback((taskId, isDone) => {
        tasksApi.toggleComplete(taskId, isDone).then(()=> {
            dispatch({type: 'TOGGLE_COMPLETE', id: taskId, isDone})
        })

    }, []);

    const addTask = useCallback((title, callbackAfterAdding) => {
            const newTask = {
                title,
                isDone: false,
            }

            tasksApi.add(newTask)
            .then((addedTask) => {
                dispatch({ type: 'ADD', task: addedTask})
                callbackAfterAdding()
                setSearchQuery('');
                newTaskInputRef.current.focus();

                setAppearingTaskId(addedTask.id)
                setTimeout(()=> {
                    setAppearingTaskId(null)
                }, 400);
            })
    }, []);

    useEffect(() => {
        newTaskInputRef.current.focus();

        tasksApi.getAll().then((serverTasks) => dispatch({type: 'SET_ALL', tasks: serverTasks}));
    }, []);

    const filteredTasks = useMemo(() => {
        const clearSearchQuery = searchQuery.trim().toLowerCase();

        return clearSearchQuery.length > 0 ?
            tasks.filter(({ title }) => title.toLowerCase().includes(clearSearchQuery)) :
            null;
    }, [searchQuery, tasks]);

    return {
        tasks,
        deleteTask,
        deleteAllTasks,
        toggleTaskComplete,
        filteredTasks,
        searchQuery,
        setSearchQuery,
        newTaskInputRef,
        addTask,
        disapearingTaskId,
        appearingTaskId,
    }
}

export default useTasks;