import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiCheck, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'Perfeito para projetos pessoais e testes.',
    features: ['100 utilizadores', '500 requisicoes/dia', '1 aplicacao', 'SDK basico', 'Suporte comunidade'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mes',
    desc: 'Para equipas e projetos profissionais.',
    features: ['5,000 utilizadores', '50,000 requisicoes/dia', '5 aplicacoes', 'Todos os SDKs', 'Suporte prioritario', 'Webhooks', 'Analytics avancados'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/mes',
    desc: 'Para grandes empresas com necessidades avancadas.',
    features: ['Utilizadores ilimitados', 'Requisicoes ilimitadas', 'Aplicacoes ilimitadas', 'SDKs personalizados', 'Suporte 24/7', 'SLA 99.99%', 'Anti-Tamper', 'Infraestrutura dedicada'],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: 'var(--accent-light)', fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>PRICING</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16 }}>
              Precos <span className="gradient-text">Simples</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Comece gratis. Escale quando precisar. Sem surpresas.
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'stretch' }}>
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  padding: 36, borderRadius: 20, background: 'var(--bg-card)',
                  border: plan.popular ? '2px solid var(--accent)' : '1px solid var(--border)',
                  position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
                }}
              >
                {plan.popular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    padding: '6px 20px', borderRadius: 100, background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
                    fontSize: 12, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiStar size={12} /> MAIS POPULAR
                  </div>
                )}
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                    <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-2px' }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 16, color: 'var(--text-tertiary)', fontWeight: 500 }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{plan.desc}</p>
                </div>
                <ul style={{ listStyle: 'none', flex: 1, marginBottom: 24 }}>
                  {plan.features.map((feat, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiCheck size={12} style={{ color: 'var(--success)' }} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', padding: '14px 0', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      background: plan.popular ? 'var(--accent)' : 'var(--bg-tertiary)',
                      color: plan.popular ? 'white' : 'var(--text-primary)',
                      border: plan.popular ? 'none' : '1px solid var(--border)',
                    }}
                  >
                    {plan.price === 'Free' ? 'Comecar Gratis' : 'Comecar Agora'}
                  </motion.button>
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}