import { ChevronRight } from 'lucide-react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.heroSection}>
      <div
        className={styles.heroBackground}
        style={{
          backgroundImage: "url('https://www.pexels.com/fr-fr/photo/mains-etre-assis-ceinture-uniforme-8038494/')",
        }}
      >
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Unleash the Spirit of Kenpo – <span className={styles.highlight}>Manage Tournaments with Ease</span>
          </h1>
          <p className={styles.subtitle}>
            Create, organize, and participate in Kenpo martial arts tournaments from anywhere.
            Elevate your club's presence in the community.
          </p>
          <div className={styles.buttonGroup}>
            <a href="#signup" className={styles.primaryBtn}>
              Create a Club Account
              <ChevronRight size={20} className={styles.icon} />
            </a>
            <a href="#features" className={styles.secondaryBtn}>
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className={styles.bottomFade}></div>
    </section>
  );
};

export default Hero;
