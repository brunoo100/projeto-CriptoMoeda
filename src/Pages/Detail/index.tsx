import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CoinsProps } from "../Home";
import styles from './detail.module.css'

interface ResponseData {
  data: CoinsProps
}
interface ErroData {
  error: string
}

type DataProps = ResponseData | ErroData


export default function Detail() {
  const { cripto } = useParams()
  const navigate = useNavigate()
  const [coins, setCoins] = useState<CoinsProps>()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function getCoin() {
      const url = `https://rest.coincap.io/v3/assets/${cripto}?&apiKey=c45bbd09d26a3f835232100f4352054397d0ec965b35487aa031d864ab8a59cd`
      try {
        fetch(url)
          .then(response => response.json())
          .then((data: DataProps) => {
            if ('error' in data) {
              navigate('/')
              return;
            }
            const price = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            })
            const priceCompat = Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact'
            })
            const resultData = {
              ...data.data,
              valorFomatado: price.format(Number(data.data.priceUsd)),
              valorDmarket: priceCompat.format(Number(data.data.marketCapUsd)),
              valorVolume: priceCompat.format(Number(data.data.volumeUsd24Hr))
            }
            setCoins(resultData)
            setLoading(false)
            // console.log(resultData);


          })
      }
      catch (err) {
        console.log(err);
        navigate('/')



      }
    }
    getCoin()
  }
    , [cripto])

  if (loading || !coins) {
    return (
      <div className={styles.container}>
        <h4 className={styles.center}>Carregando detalhes...</h4>
      </div>
    )
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.center}>{coins?.name}</h1>
      <h1 className={styles.center}>{coins?.symbol}</h1>

      <section className={styles.content}>
        <img
          className={styles.logo}
          src={`https://assets.coincap.io/assets/icons/${coins?.symbol.toLocaleLowerCase()}@2x.png`}
          alt="logo da moeda" />

        <h1> {coins?.name}|  {coins?.symbol}</h1>
        <p><strong>Preço</strong> {coins?.valorFomatado}</p>
        <a>
          <strong>
            Mercado:
          </strong>
          {coins?.valorDmarket}
        </a>

        <a>
          <strong>
            Volume:
          </strong>
          {coins?.valorVolume}
        </a>
        <a>
          <strong>
            Mudança 24H:
          </strong>
          <span 
          className={Number(coins?.changePercent24Hr) > 0 ?  styles.tdProfit: styles.tdLoss}>
            {Number(coins?.changePercent24Hr).toFixed(3)}
            </span>
        </a>
      </section>

    </div>
  );
}