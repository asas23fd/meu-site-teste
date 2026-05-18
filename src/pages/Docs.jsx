import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiCopy, FiCheck, FiTerminal } from 'react-icons/fi';

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

const codeSnippets = {
  c: `#include "auth.h"

int main() {
    auth_init("app_name", "owner_id");
    
    char* key = "XXXX-XXXX-XXXX-XXXX";
    auth_license(key);
    
    if (auth_is_activated()) {
        printf("Autenticado com sucesso!\\n");
        printf("Username: %s\\n", auth_get_username());
    }
    
    auth_cleanup();
    return 0;
}`,
  csharp: `using AuthSDK;

class Program {
    static void Main() {
        var auth = new AuthClient("app_name", "owner_id");
        
        string key = "XXXX-XXXX-XXXX-XXXX";
        var result = auth.Login(key);
        
        if (result.Success) {
            Console.WriteLine("Autenticado!");
            Console.WriteLine($"Username: {result.Username}");
            Console.WriteLine($"Expiry: {result.ExpiryDate}");
        }
    }
}`,
  lua: `local auth = require("auth")

auth.init("app_name", "owner_id")

local key = "XXXX-XXXX-XXXX-XXXX"
local success = auth.license(key)

if success then
    print("Autenticado com sucesso!")
    print("Username: " .. auth.get_username())
    print("HWID: " .. auth.get_hwid())
end`,
  js: `const AuthSDK = require('auth-sdk');

const auth = new AuthSDK({
    appName: 'app_name',
    ownerId: 'owner_id'
});

const key = 'XXXX-XXXX-XXXX-XXXX';

async function login() {
    const result = await auth.login(key);
    
    if (result.success) {
        console.log('Autenticado!');
        console.log('Username:', result.username);
        console.log('Token:', result.token);
    }
}

login();`,
};

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FiTerminal size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{language}</span>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleCopy}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, padding: '4px 8px', borderRadius: 6 }}>
          {copied ? <><FiCheck size={14} /> Copiado!</> : <><FiCopy size={14} /> Copiar</>}
        </motion.button>
      </div>
      <pre style={{ padding: 20, margin: 0, background: 'var(--bg-code)', overflow: 'auto', fontSize: 13, lineHeight: 1.7 }}>
        <code style={{ color: '#e2e8f0', fontFamily: "'JetBrains Mono', monospace" }}>{code}</code>
      </pre>
    </div>
  );
};

const DocSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg-card)' }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown size={20} style={{ color: 'var(--text-tertiary)' }} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 24px 24px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Docs() {
  const [activeTab, setActiveTab] = useState('c');

  const tabs = [
    { key: 'c', label: 'C / C++' },
    { key: 'csharp', label: 'C#' },
    { key: 'lua', label: 'Lua' },
    { key: 'js', label: 'JavaScript' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <AnimatedSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 100, background: 'var(--accent-light)', fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16 }}>DOCUMENTACAO</span>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16 }}>
              Docs <span className="gradient-text">Rapidas</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 550, margin: '0 auto', lineHeight: 1.7 }}>
              Integre a autenticacao na sua aplicacao em minutos. Escolha a sua linguagem.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, justifyContent: 'center', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <motion.button key={tab.key} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  background: activeTab === tab.key ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: activeTab === tab.key ? 'white' : 'var(--text-secondary)',
                  border: activeTab === tab.key ? 'none' : '1px solid var(--border)',
                  transition: 'all 0.2s ease',
                }}>
                {tab.label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}>
              <CodeBlock code={codeSnippets[activeTab]} language={activeTab === 'c' ? 'c' : activeTab === 'csharp' ? 'csharp' : activeTab === 'lua' ? 'lua' : 'javascript'} />
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatedSection delay={0.2}>
            <DocSection title="1. Instalacao" defaultOpen={true}>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
                Descarregue o SDK para a linguagem pretendida. Inclua os ficheiros no seu projeto.
              </p>
              <CodeBlock code={`// Adicione o SDK ao seu projeto\n// C: #include "auth.h"\n// C#: using AuthSDK;\n// Lua: local auth = require("auth")\n// JS: const AuthSDK = require('auth-sdk');`} language="setup" />
            </DocSection>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <DocSection title="2. Inicializacao">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
                Inicialize o SDK com o nome da sua aplicacao e o seu owner ID. Estes dados estao disponiveis no dashboard.
              </p>
              <CodeBlock code={`auth.init("app_name", "owner_id")`} language="init" />
            </DocSection>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <DocSection title="3. Autenticacao de Licenca">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
                Valide uma chave de licenca do utilizador. O sistema verifica a chave contra os nossos servidores e retorna o estado da autenticacao.
              </p>
              <CodeBlock code={`// Valide a chave do utilizador\nvar result = auth.license("XXXX-XXXX-XXXX-XXXX")\n\n// Verifique o resultado\nif (result.success) {\n    // Autenticado com sucesso\n    print(result.username)\n    print(result.expiry_date)\n}`} language="auth" />
            </DocSection>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <DocSection title="4. Verificacao HWID">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
                O sistema pode verificar automaticamente o HWID do utilizador para prevenir partilha de contas.
              </p>
              <CodeBlock code={`// HWID e verificado automaticamente\n// Se o HWID nao coincidir, a autenticacao falha\nvar hwid = auth.get_hwid()\nprint("HWID atual: " + hwid)`} language="hwid" />
            </DocSection>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <DocSection title="5. Webhooks e Eventos">
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 12 }}>
                Configure webhooks no dashboard para receber notificacoes sobre eventos de autenticacao em tempo real.
              </p>
              <CodeBlock code={`// Eventos disponiveis:\n// - user.login\n// - user.register\n// - license.activate\n// - license.expire\n// - hwid.mismatch`} language="webhooks" />
            </DocSection>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}