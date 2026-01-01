import { useEffect, useState } from 'react'
import './CoinAnimation.css'

function CoinAnimation({ amount, trigger }) {
  const [coins, setCoins] = useState([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (trigger && amount > 0) {
      setShow(true)
      const newCoins = Array.from({ length: Math.min(amount, 10) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: i * 0.1
      }))
      setCoins(newCoins)
      
      setTimeout(() => {
        setShow(false)
        setCoins([])
      }, 2000)
    }
  }, [trigger, amount])

  if (!show) return null

  return (
    <div className="coin-animation-container">
      {coins.map(coin => (
        <div
          key={coin.id}
          className="coin"
          style={{
            left: `${coin.x}%`,
            animationDelay: `${coin.delay}s`
          }}
        >
          🪙
        </div>
      ))}
      <div className="coin-total">+{amount} Coins!</div>
    </div>
  )
}

export default CoinAnimation

