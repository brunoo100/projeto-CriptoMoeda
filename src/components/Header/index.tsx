import style from './header.module.css'
import logo from '../../assets/logo.svg'
import { Link } from 'react-router-dom';

export default function Header() {
 return (
   <div className={style.container}>
    <Link to='/'>
    <img src={logo} alt="logo" />
    
    </Link>
   </div>
 );
}