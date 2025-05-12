import { LayoutDashboard, Users, Medal, History, ShieldCheck } from 'lucide-react';
import FeatureCard from './Features_Card';
import styles from './Features.module.css';

const Features = () => {
  const iconStyle = { width: 32, height: 32, color: '#dc2626' };

  const features = [
    {
      title: 'Club Dashboard',
      description:
        'Comprehensive dashboard for tournament creation, participant management, and event analytics.',
      icon: <LayoutDashboard style={iconStyle} />,
    },
    {
      title: 'Bracket System',
      description:
        'Real-time tournament brackets with automatic generation and updates as matches progress.',
      icon: <Medal style={iconStyle} />,
    },
    {
      title: 'Participant Profiles',
      description:
        'Detailed profiles for competitors with rank tracking, participation history, and achievements.',
      icon: <Users style={iconStyle} />,
    },
    {
      title: 'Match History',
      description:
        'Comprehensive record of past tournaments, matches, and results for clubs and participants.',
      icon: <History style={iconStyle} />,
    },
    {
      title: 'Admin Controls',
      description:
        'Powerful tools for tournament directors, referees, and scorekeepers with appropriate permissions.',
      icon: <ShieldCheck style={iconStyle} />,
    },
  ];

  return (
    <section id="features" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Powerful <span className={styles.highlight}>Features</span>
          </h2>
          <p className={styles.subtitle}>
            Our platform provides everything you need to run successful Kenpo tournaments, from registration to results.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <a href="#signup" className={styles.ctaButton}>
            Start Using These Features
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
