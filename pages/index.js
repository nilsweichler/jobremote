import styles from '../styles/Home.module.css'
import Loader from '../components/loader'


export default function Home() {
  return (
      <section className={styles.heroSection}>
          <div className={styles.heroText}>
              <h1>Entdecke hunderte Remote Jobs</h1>
              <p>Suchen Sie nach Hunderten von Jobs und finden Sie <br/>
                  einen Job, der zu Ihnen passt! <br/>
                  Oder erstellen Sie einen Job GRATIS.</p>
              <button className={styles.heroButton}>Poste einen Job</button>
          </div>
      </section>
  )
}
