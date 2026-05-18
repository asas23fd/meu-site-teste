import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiShield, FiKey, FiCode, FiUsers, FiZap, FiLock, FiActivity, FiServer, FiGlobe, FiCheck } from 'react-icons/fi';

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

const features = [
  { icon: FiShield, title: 'Autenticacao AES-256', desc: 'Encriptacao de ponta a ponta para proteger todas as credenciais e tokens.', items: ['Encriptacao AES-256', 'Tokens JWT assinados', 'Protecao contra replay attacks'] },
  { icon: FiKey, title: 'Gestao de Licencas', desc: 'Sistema completo de gestao de licencas com suporte multiplos tipos.', items: ['Lifetime keys', 'Subscription keys', 'Trial licenses', 'HWID locked'] },
  { icon: FiCode, title: 'Multi-Linguagem', desc: 'SDKs nativos para as linguagens mais populares com integracao simples.', items: ['C / C++ SDK', 'C# / .NET SDK', 'Lua SDK', 'JavaScript / Node.js'] },
  { icon: FiUsers, title: 'Gestao de Utilizadores', desc: 'Dashboard completo para gerir todos os utilizadores registados.', items: ['Registo e login', 'Perfis de utilizador', 'Roles e permissoes', 'Ban system'] },
  { icon: FiZap, title: 'Alta Performance', desc: 'API otimizada com latencia minima e cache inteligente.', items: ['< 50ms latencia', 'CDN global', 'Rate limiting', 'Load balancing'] },
  { icon: FiLock, title: 'Anti-Tamper', desc: 'Protecao contra manipulacao de binarios e verificacao de integracao.', items: ['Integrity checks', 'HWID validation', 'Code obfuscation', 'Anti-debug'] },
  { icon: FiActivity, title: 'Analytics', desc: 'Relatorios detalhados e metricas em tempo real sobre o uso.', items: ['Real-time analytics', 'Usage reports', 'API metrics', 'Custom dashboards'] },
  { icon: FiServer, title: 'Infraestrutura', desc: 'Infraestrutura global com alta disponibilidade e redundancia.', items: ['99.97% uptime SLA', 'Multi-region', 'Auto-scaling', 'DDoS protection'] },
  { icon: FiGlobe, title: 'Webhooks', desc: 'Notificacoes automaticas para eventos importantes na aplicacao.', items: ['Real-time events', 'Custom payloads', 'Retry logic', 'Event logging'] },
];

export default function Features() {
  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: 'var(--accent-light)', fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>FEATURES</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16 }}>
              Funcionalidades <span className="gradient-text">Poderosas</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto', lineHeight: 1.7 }}>
              Tudo o que precisa para proteger, gerir e escalar as suas aplicacoes com seguranca profissional.
            </p>
          </div>
        </AnimatedSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {features.map((feature, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ padding: 32, borderRadius: 18, background: 'var(--bg-card)', border: '1px solid var(--border)', height: '100%' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'white' }}>
                  <feature.icon size={22} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>{feature.desc}</p>
                <ul style={{ listStyle: 'none' }}>
                  {feature.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      <FiCheck size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}