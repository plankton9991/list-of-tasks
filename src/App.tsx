import React, { useState, useCallback, useEffect } from 'react';
import Popup from 'reactjs-popup';
import Button from '@mui/material/Button';
import { FormControl, TextField, Select, SelectChangeEvent, MenuItem } from '@mui/material';
import './App.scss';

enum Colors {
  red = 'Червона',
  yellow = 'Жовта',
  green = 'Зелена',
  blue = 'Голуба'
}

interface Task {
  name: string;
  surname: string;
  color: string;
  id: number;
}

const App: React.FC = () => {
  const [list, setList] = useState<Task[]>([]);
  const [id, setId] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [color, setColor] = useState<Colors | string>(Colors.red);
  const [isFieldEmpty, setIsFieldEmpty] = useState<string | null>(null);
  const [isLettersError, setIsLettersError] = useState<string | null>(null);
  const [isMissingId, setIsMissingId] = useState<string | null>(null);
  const [statistic, setStatistic] = useState({});
  const [idToRemove, setIdToRemove] = useState<string>('');

  useEffect(() => {
    const colorArr = Object.values(Colors);

    setStatistic(colorArr.reduce((acc, currentColor) => {
      return{...acc, [currentColor] : list.filter(task => task.color === currentColor).length}
    }, {}))
  }, [list]);

  console.log(statistic);

  const isValidateMessage = () => {
    if (!name.trim() || !surname.trim()) {
      setIsFieldEmpty('Будь ласка, введіть ваші дані');

      return false;
    }

    if (!/^[А-Яа-яёЁЇїІіЄєҐґ]+$/.test(name) || !/^[А-Яа-яёЁЇїІіЄєҐґ]+$/.test(surname)) {
      setIsLettersError('Ваші дані мають включати лише українські літери');

      return false;
    }

    return true;
  }

  const isValidateID = () => {
    if (!String(idToRemove).trim()) {
      setIsMissingId('Будь ласка, введіть id для видалення');

      return false;
    }

    if (!list.some(task => (
      task.id === +idToRemove
    ))) {
      setIsMissingId('Ваші дані мають бути в списку');

      return false;
    }

    return true;
  }

  const addTask = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (isValidateMessage()) {
      const newTask = {
        id,
        name,
        surname,
        color,
      }
      setId((currentId) => currentId + 1);

      setList((currentList) => [...currentList, newTask]);

      setName('');
      setSurname('');
      setColor(Colors.red);
    }
  }

  const removeTask = (event: React.MouseEvent<HTMLElement>) => {
    if (isValidateID()) {
      setList((currentList) => [...currentList.filter(task => task.id !== +idToRemove)]);

      setIdToRemove('');
    }
  }

  const handleNameInput = useCallback((event:React.FocusEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setIsFieldEmpty(null);
    setIsLettersError(null)
  }, []);

  const handleSurnameInput = useCallback((event:React.FocusEvent<HTMLInputElement>) => {
    setSurname(event.target.value);
    setIsFieldEmpty(null);
    setIsLettersError(null)
  }, []);

  const handleColorInput = useCallback((event: SelectChangeEvent<string>) => {
    setColor(event.target.value);
  }, []);

  const handleRemoveIdInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIdToRemove(event.target.value);
    setIsMissingId(null);
  }, []);

  return (
    <div className="App">
      <div className="App__buttons">
        <Popup 
          trigger={<Button variant="contained">+</Button>}
          modal
          nested
        >
          <div className='App__popup'>
            <FormControl 
              fullWidth
              className='App__form'
            >
              <TextField 
                id="standard-basic" 
                label="Ім'я" 
                variant="standard"
                value={name}
                type="text" 
                name="name"
                onChange={handleNameInput}
              />
              {isFieldEmpty && (
                <div>{isFieldEmpty}</div>
              )}
              {isLettersError && (
                <div>{isLettersError}</div>
              )}
              <TextField 
                id="standard-basic" 
                label="Прізвище" 
                variant="standard"
                value={surname}
                type="text" 
                name="surname"
                onChange={handleSurnameInput}
              />
              {isFieldEmpty && (
                <div>{isFieldEmpty}</div>
              )}
              {isLettersError && (
                <div>{isLettersError}</div>
              )}
              <Select
                labelId="demo-simple-select-label"
                id="addTaskForm"
                value={color}
                name="color" 
                onChange={(e) => handleColorInput(e)}
              >
                <MenuItem value={Colors.red}>{Colors.red}</MenuItem>
                <MenuItem value={Colors.yellow}>{Colors.yellow}</MenuItem>
                <MenuItem value={Colors.green}>{Colors.green}</MenuItem>
                <MenuItem value={Colors.blue}>{Colors.blue}</MenuItem>
              </Select>
              <Button 
                variant="outlined"
                onClick={(e) => addTask(e)}
              >
                Додати
              </Button>
            </FormControl>
          </div>
        </Popup>
        
        <Popup 
          trigger={<Button className='App__button' variant="contained">-</Button>} 
          modal
          nested
        >
          <FormControl 
            fullWidth
            className='App__form'
          >
            <TextField 
              id="standard-basic" 
              label="Id для видалення" 
              variant="standard"
              value={idToRemove}
              type="text" 
              name="idToRemove" 
              placeholder="Id"
              onChange={handleRemoveIdInput}
            />
            {isMissingId && (
              <div>{isMissingId}</div>
            )}
            <Button 
              variant="outlined"
              onClick={(e) => removeTask(e)}
            >
              Видалити
            </Button>
          </FormControl>
        </Popup>
      </div>
      
      <div className="App__information">
        <div className="ListOfTodos__list">
          {list.map(task => (
            <div key={task.id} className="ListOfTodos__task">
              <span>Task id: {task.id}</span>
              <h3>{task.name + ' ' + task.surname}</h3>
              <p>Колір пробірки: {task.color}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="App__statistics">
        {
          Object.entries(statistic).map((color) => (
            <div>
              <span className={'App__statistics-color'}>
                {color[0] + ': ' + color[1]}
              </span>
            </div>
          ))
        }
        </div>
    </div>
  );
}

export default App;
