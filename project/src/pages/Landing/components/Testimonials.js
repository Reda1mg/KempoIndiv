import React from 'react';
import styles from './Testimonials.module.css';
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        "This platform has revolutionized how we run our annual Kenpo tournament. What used to take weeks of preparation now happens with a few clicks. It's been a game-changer for our dojo.",
      author: 'Sensei Michael Chen',
      title: 'Head Instructor, Golden Dragon Kenpo',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    },
    {
      quote:
        'The bracket management system is flawless. As a tournament director, I can focus on ensuring quality matches rather than struggling with paperwork and logistics.',
      author: 'Sarah Johnson',
      title: 'Tournament Director, National Kenpo Association',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    },
    {
      quote:
        'Our students love being able to track their tournament history and achievements. The platform has helped increase participation in our events by over 40%.',
      author: 'Master James Wilson',
      title: 'Owner, Elite Kenpo Academy',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    },
  ];

  return (
    <section id="testimonials" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.stats}>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>50+</div>
            <p className={styles.statLabel}>Tournaments Hosted</p>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>1,200+</div>
            <p className={styles.statLabel}>Registered Competitors</p>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>95%</div>
            <p className={styles.statLabel}>Satisfaction Rate</p>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statNumber}>30+</div>
            <p className={styles.statLabel}>Kenpo Schools</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
