import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>X Automation – @landlordrice & @cryptotrustt</title>
        <meta name="description" content="Automated X (Twitter) bot for Indonesian engagement" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>X Automation Engine</h1>
          <p className={styles.subtitle}>
            Dual‑account bot that tweets, likes & replies to Indonesian crypto & meme conversations every 5 minutes.
          </p>
        </section>

        <section className={styles.cards}>
          <article className={styles.card}>
            <div className={styles.avatar}>🦁</div>
            <h2 className={styles.cardTitle}>@landlordrice</h2>
            <p className={styles.cardDesc}>
              <strong>Persona:</strong> Alpha / analytical<br />
              <strong>Style:</strong> Indonesian replies, data‑driven insights<br />
              <strong>Schedule:</strong> Original tweet every 3 h, reply cycle 5 min
            </p>
            <ul className={styles.features}>
              <li>✅ Tweets 4‑7×/day</li>
              <li>✅ Replies to ID‑lang crypto, jbjb, meme tweets</li>
              <li>✅ Auto‑like before reply</li>
            </ul>
          </article>

          <article className={styles.card}>
            <div className={styles.avatar}>🦎</div>
            <h2 className={styles.cardTitle}>@cryptotrustt</h2>
            <p className={styles.cardDesc}>
              <strong>Persona:</strong> Degen / meme<br />
              <strong>Style:</strong> Indonesian slang, high‑energy replies<br />
              <strong>Schedule:</strong> Original tweet every 4 h, reply cycle 5 min
            </p>
            <ul className={styles.features}>
              <li>✅ Tweets 3‑5×/day</li>
              <li>✅ Replies to ID‑lang airdrop, giveaway, jbjb tweets</li>
              <li>✅ Auto‑like before reply</li>
            </ul>
          </article>
        </section>

        <section className={styles.tech}>
          <h3 className={styles.sectionTitle}>Tech Stack</h3>
          <div className={styles.techGrid}>
            <span>Next.js 14 (App Router)</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
            <span>Node 20 (systemd service)</span>
            <span>X GraphQL API (no browser)</span>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Running 24/7 on Ubuntu – auto‑restart via systemd.</p>
        </footer>
      </main>
    </div>
  );
}