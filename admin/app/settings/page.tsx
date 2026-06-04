'use client';

import { useState, useEffect } from 'react';

interface Settings {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  firebaseProjectId: string;
  firebaseApiKey: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  jwtSecret: string;
  corsOrigin: string;
  appName: string;
  dailyLikeLimit: string;
  subscriptionPriceGold: string;
  subscriptionPricePlatinum: string;
  botAutoLikePercentage: string;
  botReplyDelay: string;
  maxBotReplies: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    razorpayKeyId: '',
    razorpayKeySecret: '',
    firebaseProjectId: '',
    firebaseApiKey: '',
    cloudinaryCloudName: '',
    cloudinaryApiKey: '',
    cloudinaryApiSecret: '',
    jwtSecret: '',
    corsOrigin: '',
    appName: 'MatchKar',
    dailyLikeLimit: '20',
    subscriptionPriceGold: '199',
    subscriptionPricePlatinum: '399',
    botAutoLikePercentage: '35',
    botReplyDelay: '3',
    maxBotReplies: '4',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('payment');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch {
      // Settings not loaded yet, use defaults
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage('');
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage('Settings saved successfully!');
      } else {
        setMessage('Failed to save settings');
      }
    } catch {
      setMessage('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'payment', label: 'Payment (Razorpay)', icon: '💳' },
    { id: 'firebase', label: 'Firebase', icon: '🔥' },
    { id: 'cloudinary', label: 'Cloudinary', icon: '☁️' },
    { id: 'app', label: 'App Config', icon: '📱' },
    { id: 'bot', label: 'Bot Settings', icon: '🤖' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-red-50 border'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">💳 Razorpay Payment Gateway</h3>
          <p className="text-sm text-gray-500 mb-4">Configure Razorpay for subscription payments. Get keys from https://dashboard.razorpay.com</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key ID</label>
              <input
                type="text"
                value={settings.razorpayKeyId}
                onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                placeholder="rzp_live_xxxxxxxxxxxxx"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                value={settings.razorpayKeySecret}
                onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                placeholder="Enter secret key"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gold Plan Price (INR)</label>
                <input
                  type="number"
                  value={settings.subscriptionPriceGold}
                  onChange={(e) => handleChange('subscriptionPriceGold', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platinum Plan Price (INR)</label>
                <input
                  type="number"
                  value={settings.subscriptionPricePlatinum}
                  onChange={(e) => handleChange('subscriptionPricePlatinum', e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Firebase Tab */}
      {activeTab === 'firebase' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">🔥 Firebase Configuration</h3>
          <p className="text-sm text-gray-500 mb-4">Firebase Auth settings. Get from Firebase Console → Project Settings</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firebase Project ID</label>
              <input
                type="text"
                value={settings.firebaseProjectId}
                onChange={(e) => handleChange('firebaseProjectId', e.target.value)}
                placeholder="matchkar"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firebase API Key</label>
              <input
                type="text"
                value={settings.firebaseApiKey}
                onChange={(e) => handleChange('firebaseApiKey', e.target.value)}
                placeholder="AIzaSy..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Cloudinary Tab */}
      {activeTab === 'cloudinary' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">☁️ Cloudinary (Photo Upload)</h3>
          <p className="text-sm text-gray-500 mb-4">Photo storage configuration. Get from Cloudinary Dashboard</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Name</label>
              <input
                type="text"
                value={settings.cloudinaryCloudName}
                onChange={(e) => handleChange('cloudinaryCloudName', e.target.value)}
                placeholder="deru46peb"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input
                type="text"
                value={settings.cloudinaryApiKey}
                onChange={(e) => handleChange('cloudinaryApiKey', e.target.value)}
                placeholder="713726266773949"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Secret</label>
              <input
                type="password"
                value={settings.cloudinaryApiSecret}
                onChange={(e) => handleChange('cloudinaryApiSecret', e.target.value)}
                placeholder="Enter secret"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* App Config Tab */}
      {activeTab === 'app' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">📱 App Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App Name</label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Daily Like Limit (Free Users)</label>
              <input
                type="number"
                value={settings.dailyLikeLimit}
                onChange={(e) => handleChange('dailyLikeLimit', e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CORS Origins (comma separated)</label>
              <input
                type="text"
                value={settings.corsOrigin}
                onChange={(e) => handleChange('corsOrigin', e.target.value)}
                placeholder="https://matchkar.com,https://www.matchkar.com"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bot Settings Tab */}
      {activeTab === 'bot' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">🤖 Bot Behavior Settings</h3>
          <p className="text-sm text-gray-500 mb-4">Configure how bots interact with real users</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Like Percentage (%)</label>
              <input
                type="number"
                value={settings.botAutoLikePercentage}
                onChange={(e) => handleChange('botAutoLikePercentage', e.target.value)}
                placeholder="35"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">Percentage of new users that bots will auto-like</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reply Delay (minutes)</label>
              <input
                type="number"
                value={settings.botReplyDelay}
                onChange={(e) => handleChange('botReplyDelay', e.target.value)}
                placeholder="3"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">Minutes before bot replies to a message</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Bot Replies per Conversation</label>
              <input
                type="number"
                value={settings.maxBotReplies}
                onChange={(e) => handleChange('maxBotReplies', e.target.value)}
                placeholder="4"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">After this many replies, bot stops responding</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="text-lg font-bold mb-4">🔒 Security Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JWT Secret</label>
              <input
                type="password"
                value={settings.jwtSecret}
                onChange={(e) => handleChange('jwtSecret', e.target.value)}
                placeholder="Your JWT secret key"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
