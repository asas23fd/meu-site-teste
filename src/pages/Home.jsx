import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FiShield, FiKey, FiCode, FiUsers, FiZap, FiLock, FiArrowRight, FiActivity, FiServer, FiClock } from 'react-icons/fi';

function AnimatedSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ParticlesBackground() {
  const particles = useMemo(() => {
    const seeded = (i, n) => ((i * 9301 + 49297) % 233280) / 233280;
    return [...Array(20)].map((_, i) => ({
      width: seeded(i, 1) * 4 + 2,
      height: seeded(i, 2) * 4 + 2,
      left: `${seeded(i, 3) * 100}%`,
      top: `${seeded(i, 4) * 100}%`,
      duration: seeded(i, 5) * 3 + 2,
      delay: seeded(i, 6) * 2,
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: p.width,
            height: p.height,
            borderRadius: '50%',
            background: 'var(--accent)',
            opacity: 0.15,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, value, label, delay }) {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          padding: '32px 24px',
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px', color: 'var(--accent)',
        }}>
          <Icon size={22} />
        </div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</div>
      </motion.div>
    </AnimatedSection>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -6, boxShadow: 'var(--shadow-xl)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          padding: '32px',
          borderRadius: 16,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          cursor: 'default',
          height: '100%',
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20, color: 'white',
        }}>
          <Icon size={22} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{desc}</p>
      </motion.div>
    </AnimatedSection>
  );
}

function CodeBlock({ language, code, delay }) {
  return (
    <AnimatedSection delay={delay}>
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-code)',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
            {language}
          </span>
        </div>
        <pre style={{
          padding: '20px',
          margin: 0,
          fontSize: 13,
          lineHeight: 1.8,
          fontFamily: "'JetBrains Mono', monospace",
          color: '#e2e8f0',
          overflowX: 'auto',
        }}>
          <code>{code}</code>
        </pre>
      </div>
    </AnimatedSection>
  );
}

export default function Home() {
  const codeExamples = {
    js: `const AuthShield = require('authshield');

const client = new AuthShield({
  appKey: 'YOUR_APP_KEY',
  secret: 'YOUR_SECRET'
});

// Autenticar utilizador
const session = await client.auth({
  username: 'user@example.com',
  password: 'secure_pass'
});

console.log('Sessão:', session.token);`,
    csharp: `using AuthShield;

var client = new AuthShieldClient(new Config
{
    AppKey = "YOUR_APP_KEY",
    Secret = "YOUR_SECRET"
});

// Autenticar utilizador
var session = await client.AuthenticateAsync(
    "user@example.com",
    "secure_pass"
);

Console.WriteLine($"Token: {session.Token}");`,
    lua: `local AuthShield = require("authshield")

local client = AuthShield.new({
    appKey = "YOUR_APP_KEY",
    secret = "YOUR_SECRET"
})

-- Autenticar utilizador
local session = client:auth({
    username = "user@example.com",
    password = "secure_pass"
})

print("Token: " .. session.token)`,
    c: `#include <authshield.h>

int main() {
    AS_Client* client = as_create_client(
        "YOUR_APP_KEY",
        "YOUR_SECRET"
    );

    // Autenticar utilizador
    AS_Session* session = as_authenticate(
        client,
        "user@example.com",
        "secure_pass"
    );

    printf("Token: %s\\n",
        session->token);

    as_destroy_client(client);
    return 0;
}`,
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '120px 24px 80px',
      }}>
        <ParticlesBackground />
        
        {/* Gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-glow), transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.4,
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 32 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 100,
              background: 'var(--accent-light)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--accent)',
              marginBottom: 32,
            }}>
              <FiZap size={14} />
              Plataforma de Autenticação #1
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(36px, 6vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              marginBottom: 24,
            }}
          >
            Autenticação{' '}
            <span className="gradient-text">Segura</span>
            <br />
            para as suas apps
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              maxWidth: 600,
              margin: '0 auto 40px',
              lineHeight: 1.7,
            }}
          >
            Proteja as suas aplicações com autenticação multi-linguagem, gestão de licenças 
            e dashboard profissional. Suporte para C, C#, Lua e JavaScript.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px var(--accent-glow)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                }}
              >
                Começar Agora
                <FiArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/docs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <FiCode size={16} />
                Ver Documentação
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              display: 'flex',
              gap: 32,
              justifyContent: 'center',
              marginTop: 60,
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: FiShield, text: 'Encriptação AES-256' },
              { icon: FiClock, text: '99.97% Uptime' },
              { icon: FiUsers, text: '10K+ Utilizadores' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500,
              }}>
                <item.icon size={16} style={{ color: 'var(--accent)' }} />
                {item.text}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '60px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
        }}>
          <StatCard icon={FiUsers} value="10,247" label="Utilizadores Ativos" delay={0} />
          <StatCard icon={FiKey} value="34,560" label="Licenças Geradas" delay={0.1} />
          <StatCard icon={FiActivity} value="156K+" label="API Calls/Dia" delay={0.2} />
          <StatCard icon={FiServer} value="99.97%" label="Uptime Garantido" delay={0.3} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: 100,
                background: 'var(--accent-light)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: 16,
              }}>FEATURES</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
                Tudo o que precisa
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
                Ferramentas profissionais para proteger e gerir as suas aplicações
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            <FeatureCard
              icon={FiShield}
              title="Autenticação Segura"
              desc="Sistema de autenticação com encriptação AES-256, proteção contra brute-force e gestão de sessões seguras."
              delay={0}
            />
            <FeatureCard
              icon={FiKey}
              title="Gestão de Licenças"
              desc="Crie, valide e geri licenças para os seus produtos. Suporte para trials, subscriptions e lifetime keys."
              delay={0.1}
            />
            <FeatureCard
              icon={FiCode}
              title="Multi-Linguagem"
              desc="SDKs nativos para C/C++, C# (.NET), Lua e JavaScript. Integração rápida e simples em qualquer projeto."
              delay={0.2}
            />
            <FeatureCard
              icon={FiUsers}
              title="Dashboard Completo"
              desc="Painel de controlo com analytics em tempo real, gestão de utilizadores e monitorização de licenças."
              delay={0.3}
            />
            <FeatureCard
              icon={FiZap}
              title="API de Alta Performance"
              desc="API RESTful com latência <50ms, rate limiting inteligente e cache distribuído para máxima performance."
              delay={0.4}
            />
            <FeatureCard
              icon={FiLock}
              title="Proteção Anti-Tamper"
              desc="Detecção de manipulação de binários, verificação de integração e ofuscação de código integrada."
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Code Examples Section */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{
                display: 'inline-block',
                padding: '6px 16px',
                borderRadius: 100,
                background: 'var(--accent-light)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: 16,
              }}>INTEGRAÇÃO</span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
                Algumas linhas de código
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
                Integre a autenticação na sua aplicação em minutos
              </p>
            </div>
          </AnimatedSection>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 24,
          }}>
            <CodeBlock language="JavaScript / Node.js" code={codeExamples.js} delay={0} />
            <CodeBlock language="C# / .NET" code={codeExamples.csharp} delay={0.1} />
            <CodeBlock language="Lua" code={codeExamples.lua} delay={0.2} />
            <CodeBlock language="C / C++" code={codeExamples.c} delay={0.3} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <AnimatedSection>
            <motion.div
              whileHover={{ scale: 1.01 }}
              style={{
                padding: '64px 48px',
                borderRadius: 24,
                background: 'linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent)',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'white', letterSpacing: '-1px', marginBottom: 16 }}>
                  Pronto para proteger as suas apps?
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
                  Comece hoje com o plano gratuito. Sem cartão de crédito necessário.
                </p>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '14px 36px',
                      borderRadius: 12,
                      fontSize: 15,
                      fontWeight: 700,
                      background: 'white',
                      color: '#6366f1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    }}
                  >
                    Criar Conta Gratuita
                    <FiArrowRight size={16} />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}