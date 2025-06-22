import { Link, useNavigate } from 'react-router-dom';
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs';
import { useEffect, useState , type FormEvent} from 'react';

export interface CoinsProps{
  id:string,
  name:string,
  changePercent24Hr:string,
  explorer:string,
marketCapUsd:string,
priceUsd:string,
rank:string,
supply:string,
symbol:string,
tokens?:any,
volumeUsd24Hr:string,
vwap24Hr:string,
valorFomatado?:string,
valorDmarket?:string,
valorVolume?:string,
}

interface DataProps{
  data: CoinsProps[]
}

export default function Home() {
  const [input , setInput]= useState('');
  const [coins,setCoins] = useState<CoinsProps[]>([])
  const [ offSet, setOffSet] = useState(0)
  
   const navigate = useNavigate()

   useEffect(() =>{
    getData()
   }, [offSet]);

// buscar dados na api 
   async function getData() {
    const url =`https://rest.coincap.io/v3/assets?limit=10&offset=${offSet}&apiKey=c45bbd09d26a3f835232100f4352054397d0ec965b35487aa031d864ab8a59cd`
    fetch(url)
    .then(res => res.json())
    .then((data:DataProps)=>{
      const coinsData = data.data
      const price = Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD'
      })
      const priceCompat =  Intl.NumberFormat('en-US',{
        style:'currency',
        currency:'USD',
        notation:'compact'
      })
      const fomatResult = coinsData.map((item) =>{
        const formated = {
          ...item,
          valorFomatado: price.format(Number(item.priceUsd)),
          valorDmarket: priceCompat.format(Number(item.marketCapUsd)),
          valorVolume:priceCompat.format(Number(item.volumeUsd24Hr))
          

        }
        return formated
      }) 
      // console.log('esse ', fomatResult);
      const listCoins =[
        ...coins,
        ...fomatResult
      ]
      setCoins(listCoins)
                 
    })

   }


  function pesquisar(e:FormEvent){
    e.preventDefault();
if(input ==='') return
navigate(`/detail/${input}`)
    // console.log('esse meu evento', input);
    
  }
  function mostarMais(){
    // alert('teste')
    if(offSet == 0){
      setOffSet(10)
      return
    }
    setOffSet (offSet + 10)

  }
  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={pesquisar}>
        <input
          type="text"
          placeholder='Digitar o nome da moeda ... EX:Bitcon'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color='#fff' />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope='col'>Moeda</th>
            <th scope='col'>Valor Mercado</th>
            <th scope='col'>Preço</th>
            <th scope='col'>Volume</th>
            <th scope='col'>Mudança 24H</th>
          </tr>
        </thead>
        <tbody id='tbody'>
          {coins.length > 0 && coins.map((item)=>(
            
            <tr className={styles.tr} key={item.id}>

            <div className={styles.name}>
              <img 
              className={styles.logo}
              src={`https://assets.coincap.io/assets/icons/${item.symbol.toLocaleLowerCase()}@2x.png`} 
              alt="LOGO" />
              <td className={styles.tdLabel} data-label='Moeda'>
                <Link to={`/detail/${item.id}`}>
                  <span>{item.name}</span> | {item.symbol}
                </Link>
              </td>
            </div>

            <td className={styles.tdLabel} data-label='Valor Mercado'>
              {item.valorDmarket}
            </td>

            <td className={styles.tdLabel} data-label='Preço'>
              {item.valorFomatado}
            </td>

            <td className={styles.tdLabel} data-label='Volume'>
             {item.valorVolume}
            </td>

            <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss } data-label='Mudança 24H'>
              <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
            </td>

          </tr>
          ))} 
        </tbody>
      </table>
      <button className={styles.buscarMore} onClick={mostarMais}>
        Carregar mais...
      </button>
    </main>
  );
}