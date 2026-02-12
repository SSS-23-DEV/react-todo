import Field from "@/shared/ui/Field";
import Button from "@/shared/ui/Button";
import { TasksContext } from "@/entities/todo";
import { useContext, useState } from "react";

const AddTaskForm = (props) => {
  const { styles } = props

  const {
    addTask,
    newTaskInputRef,
  } = useContext(TasksContext);

  const [error, setError] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const clearNewTaskTitle = newTaskTitle.trim();
  const isNewTaskTitleEmpty = clearNewTaskTitle.length === 0;

  const onSubmit = (event) => {
    event.preventDefault();
    if(!isNewTaskTitleEmpty){
      addTask(clearNewTaskTitle, 
        ()=>setNewTaskTitle('')
      );
    }
  };

  const onInput = (event) => {
    const {value} = event.target;
    const clearValue = value.trim();
    const hasOnlySpaces = value.length > 0 && clearValue.length === 0;

    setNewTaskTitle(value)
    setError(hasOnlySpaces ? 'The task cannot be empty' : '');
  }

    return (
      <form className={styles.form} onSubmit={onSubmit}>
        <Field 
          className={styles.field}
          label = "New task title"
          id = "new-task"
          value={newTaskTitle}
          error={error}
          onInput={onInput}
          ref={newTaskInputRef}
        />
        <Button 
        type="submit"
        isDisabled={isNewTaskTitleEmpty}
        >
          Add
          </Button>
      </form>

    )
}

export default AddTaskForm;