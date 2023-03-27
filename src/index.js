import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

console.info(`Текущая версия: ${process.env.REACT_APP_VERSION}`);

ReactDOM.render(
        <App/>
    ,
    document.getElementById('root')
);

