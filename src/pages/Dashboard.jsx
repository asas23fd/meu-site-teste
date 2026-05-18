import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiKey, FiActivity, FiServer, FiCopy, FiCheck, FiCode, FiLogOut, FiUser, FiCalendar, FiShield, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const LANG_TABS = [
  { id: 'js', label: 'JavaScript', icon: '🟨' },
  { id: 'csharp', label: 'C#', icon: '🟪' },
  { id: 'lua', label: 'Lua', icon: '🔵' },
  { id: 'c', label: 'C/C++', icon: '⚙️' },
];

const CODE_SNIPPETS = {
  js: `// AuthShield - JavaScript SDK
const AuthShield = require('authshield');

const client = new AuthShield({
  appKey: 'YOUR_APP_KEY',
  secret: 'YOUR_SECRET'
});

// Verificar licença
const license = await client.verifyLicense(
  'LICENSE_KEY'
);

if (license.valid) {
  console.log('Licença válida!');
  console.log('Plano:', license.type);
  console.log('Expira:', license.expires);
} else {
  console.log('Licença inválida');
  process.exit(1);
}`,
  csharp: `// AuthShield - C# SDK
using AuthShield;

var client = new AuthShieldClient(new Config
{
    AppKey = "YOUR_APP_KEY",
    Secret = "YOUR_SECRET"
});

// Verificar licença
var license = await client
    .VerifyLicenseAsync("LICENSE_KEY");

if (license.IsValid)
{
    Console.WriteLine("Licença válida!");
    Console.WriteLine($"Plano: {license.Type}");
    Console.WriteLine($"Expira: {license.Expires}");
}
else
{
    Console.WriteLine("Licença inválida");
    Environment.Exit(1);
}`,
  lua: `-- AuthShield - Lua SDK
local AuthShield = require("authshield")

local client = AuthShield.new({
    appKey = "YOUR_APP_KEY",
    secret = "YOUR_SECRET"
})

-- Verificar licença
local license = client:verifyLicense(
    "LICENSE_KEY"
)

if license.valid then
    print("Licença válida!")
    print("Plano: " .. license.type)
    print("Expira: " .. license.expires)
else
    print("Licença inválida")
    os.exit(1)
end`,
  c: `// AuthShield - C SDK
#include <authshield.h>

int main() {
    AS_Client* client = as_create_client(
        "YOUR_APP_KEY",
        "YOUR_SECRET"
    );

    // Verificar licença
    AS_License* license = as_verify_license(
        client, "LICENSE_KEY"
    );

    if (license->valid) {
        printf("Licença válida!\\n");
        printf("Plano: %s\\n", license->type);
        printf("Expira: %s\\n", license->expires);
    } else {
        printf("Licença inválida\\n");
        as_destroy_client(client);
        return 1;
    }

    as_destroy_client(client);
    return 0;
}`,
};

function StatBox({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        padding: '20px', borderRadius: 14,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: color || 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)',
        }}>
          <Icon size={16} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
    </motion.div>
  );
}

function LicenseRow({ license }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(license.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px', borderRadius: 12,
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      flexWrap: 'wrap', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
        <FiKey size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <code style={{ fontSize: 13, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
          {license.key}
        </code>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: license.status === 'active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: license.status === 'active' ? 'var(--success)' : 'var(--danger)',
        }}>{license.status}</span>
        <span style={{
          padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
          background: 'var(--accent-light)', color: 'var(--accent)',
        }}>{license.type}</span>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
          {license.uses}/{license.maxUses}
        </span>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={copy}
          style={{
            width: 30, height: 30, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: copied ? 'rgba(34,197,94,0.1)' : 'var(--bg-tertiary)',
            color: copied ? 'var(--success)' : 'var(--text-tertiary)',
            border: '1px solid var(--border)',
          }}
        >
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
        </motion.button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, getLicenses, getStats, logout } = useAuth();
  const licenses = getLicenses();
  const stats = getStats();
  const [activeTab, setActiveTab] = useState('js');
  const [copiedCode, setCopiedCode] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(CODE_SNIPPETS[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '100px 24px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            marginBottom: 32, flexWrap: 'wrap', gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
              Dashboard
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              Bem-vindo, <strong>{user?.username}</strong> — Plano: {user?.plan}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              fontSize: 13, color: 'var(--text-secondary)',
            }}>
              <FiUser size={14} />
              {user?.username}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              style={{
                padding: '8px 14px', borderRadius: 10,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--danger)', fontSize: 13, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <FiLogOut size={14} />
              Sair
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16, marginBottom: 32,
          }}
        >
          <StatBox icon={FiUsers} label="Utilizadores" value={stats.totalUsers.toLocaleString()} />
          <StatBox icon={FiActivity} label="Ativos" value={stats.activeUsers.toLocaleString()} />
          <StatBox icon={FiKey} label="Licenças" value={stats.totalLicenses.toLocaleString()} />
          <StatBox icon={FiServer} label="Uptime" value={`${stats.uptime}%`} />
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16, marginBottom: 32,
          }}
        >
          <div style={{
            padding: 20, borderRadius: 14, background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Informações da Conta
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: FiUser, label: 'Username', value: user?.username },
                { icon: FiShield, label: 'Plano', value: user?.plan },
                { icon: FiCalendar, label: 'Expira', value: user?.expires },
                { icon: FiBarChart2, label: 'Role', value: user?.role },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <item.icon size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)', minWidth: 70 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            padding: 20, borderRadius: 14, background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              API Stats
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: FiActivity, label: 'API Calls', value: stats.apiCalls.toLocaleString() },
                { icon: FiKey, label: 'Lic. Ativas', value: stats.activeLicenses.toLocaleString() },
                { icon: FiServer, label: 'Latência', value: '< 50ms' },
                { icon: FiShield, label: 'Segurança', value: 'AES-256' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <item.icon size={14} style={{ color: 'var(--accent)' }} />
                  <span style={{ fontSize: 13, color: 'var(--text-tertiary)', minWidth: 80 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Licenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: 24, borderRadius: 16, background: 'var(--bg-card)',
            border: '1px solid var(--border)', marginBottom: 32,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Licenças</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {licenses.map((lic, i) => (
              <LicenseRow key={i} license={lic} />
            ))}
          </div>
        </motion.div>

        {/* Code Integration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{
            padding: 24, borderRadius: 16, background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Integração — SDKs</h3>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {LANG_TABS.map(tab => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px', borderRadius: 10,
                  fontSize: 13, fontWeight: 600,
                  background: activeTab === tab.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                  border: '1px solid ' + (activeTab === tab.id ? 'var(--accent)' : 'var(--border)'),
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Code block */}
          <div style={{
            borderRadius: 12, overflow: 'hidden',
            border: '1px solid var(--border)', background: 'var(--bg-code)',
          }}>
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {LANG_TABS.find(t => t.id === activeTab)?.label}
                </span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={copyCode}
                style={{
                  padding: '4px 10px', borderRadius: 6,
                  fontSize: 11, fontWeight: 500,
                  background: copiedCode ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.1)',
                  color: copiedCode ? '#22c55e' : 'rgba(255,255,255,0.5)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {copiedCode ? <FiCheck size={10} /> : <FiCopy size={10} />}
                {copiedCode ? 'Copiado!' : 'Copiar'}
              </motion.button>
            </div>
            <AnimatePresence mode="wait">
              <motion.pre
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '20px', margin: 0,
                  fontSize: 13, lineHeight: 1.8,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#e2e8f0', overflowX: 'auto',
                }}
              >
                <code>{CODE_SNIPPETS[activeTab]}</code>
              </motion.pre>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}