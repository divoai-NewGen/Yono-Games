'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Upload,
  Lock,
  ShieldCheck,
  Gamepad2,
  Flame,
  Star,
  Check,
  X,
  ArrowLeft,
  RefreshCw,
  Eye,
  Sliders,
  AlertCircle,
  Mail,
  MessageSquare,
  Inbox,
  Clock,
  CheckCircle2,
  Reply,
  Filter
} from 'lucide-react';
import { Game, GameCategory } from '@/types/game';
import { ContactMessage } from '@/types/message';
import { generateAutoSeo, generateSlug } from '@/utils/seoGenerator';

const CATEGORIES: GameCategory[] = [
  'Yono Games',
  'Other Best Games',
];

export default function AdminDashboardPage() {
  // Navigation / Tab state
  const [activeSection, setActiveSection] = useState<'games' | 'messages'>('games');

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Games Data state
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Messages Data state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [deleteMessageConfirmId, setDeleteMessageConfirmId] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'basic' | 'content' | 'seo'>('basic');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Game>>({
    name: '',
    slug: '',
    category: 'Yono Games',
    tagline: '',
    logo: '/images/hero-full-ribbon-3d.png',
    thumbnail: '/images/hero-full-ribbon-3d.png',
    heroImage: '/images/hero-full-ribbon-3d.png',
    screenshots: ['/images/hero-full-ribbon-3d.png'],
    rating: 4.8,
    ratingCount: '24.5K reviews',
    players: '35,000+ Online',
    downloads: '1.5M+ Downloads',
    bonus: '₹1,500 Welcome Bonus',
    shortDescription: '',
    description: '',
    features: [],
    howToPlay: [],
    downloadUrl: '',
    version: 'v5.1.0',
    size: '42.5 MB',
    featured: false,
    newRelease: true,
    popular: true,
    seoTitle: '',
    seoDescription: '',
  });

  // Check auth session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('yono_admin_auth');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch games
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/games');
      const data = await res.json();
      if (data.success && data.games) {
        setGames(data.games);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
      showToast('error', 'Failed to fetch games from server.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch contact messages
  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
      showToast('error', 'Failed to fetch inquiries.');
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchGames();
      fetchMessages();
    }
  }, [isAuthenticated]);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle Message Status (read / unread)
  const handleToggleMessageStatus = async (msg: ContactMessage, newStatus?: 'read' | 'unread') => {
    const targetStatus = newStatus || (msg.status === 'unread' ? 'read' : 'unread');
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: msg.id,
          status: targetStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: targetStatus } : m));
        if (viewingMessage && viewingMessage.id === msg.id) {
          setViewingMessage({ ...viewingMessage, status: targetStatus });
        }
        showToast('success', `Message marked as ${targetStatus}`);
      }
    } catch (err) {
      showToast('error', 'Failed to update message status.');
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (viewingMessage && viewingMessage.id === id) {
          setViewingMessage(null);
        }
        setDeleteMessageConfirmId(null);
        showToast('success', 'Inquiry deleted successfully.');
      }
    } catch (err) {
      showToast('error', 'Failed to delete message.');
    }
  };

  // Auth handler (calls secure server API reading from .env)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!usernameInput.trim()) {
      setAuthError('Please enter Admin Username');
      return;
    }
    if (!passwordInput.trim()) {
      setAuthError('Please enter Admin Password');
      return;
    }

    try {
      setIsAuthenticating(true);
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('yono_admin_auth', 'true');
        setPasswordInput('');
        setAuthError('');
      } else {
        setAuthError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setAuthError('Authentication request failed. Please check connection.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('yono_admin_auth');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Unread messages count
  const unreadMessagesCount = useMemo(() => {
    return messages.filter(m => m.status === 'unread').length;
  }, [messages]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [games, searchQuery, selectedCategory]);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      const matchesSearch =
        msg.name.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
        msg.email.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
        msg.category.toLowerCase().includes(messageSearchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(messageSearchQuery.toLowerCase());
      const matchesStatus =
        messageStatusFilter === 'all' || msg.status === messageStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, messageSearchQuery, messageStatusFilter]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingGame(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Yono Games',
      tagline: '',
      logo: '/images/hero-full-ribbon-3d.png',
      thumbnail: '/images/hero-full-ribbon-3d.png',
      heroImage: '/images/hero-full-ribbon-3d.png',
      screenshots: ['/images/hero-full-ribbon-3d.png'],
      rating: 4.8,
      ratingCount: '24.5K reviews',
      players: '35,000+ Online',
      downloads: '1.5M+ Downloads',
      bonus: '₹1,500 Welcome Bonus',
      shortDescription: '',
      description: '',
      features: [
        'Certified Random Number Generator (RNG) fair play standard',
        'Instant withdrawal processing with round-the-clock support',
        'Daily login rewards and exclusive VIP loyalty perks'
      ],
      howToPlay: [
        'Download and launch the application on your mobile device',
        'Choose your preferred table room based on stakes',
        'Withdraw your earnings directly to your UPI ID'
      ],
      downloadUrl: '',
      version: 'v5.1.0',
      size: '42.5 MB',
      featured: false,
      newRelease: true,
      popular: true,
      seoTitle: '',
      seoDescription: '',
    });
    setActiveModalTab('basic');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (game: Game) => {
    setEditingGame(game);
    setFormData({ ...game });
    setActiveModalTab('basic');
    setIsModalOpen(true);
  };

  // One-Click Auto-SEO Generation
  const handleGenerateAutoSeo = () => {
    if (!formData.name?.trim()) {
      showToast('error', 'Please enter a Game Name first to generate SEO.');
      return;
    }

    const autoData = generateAutoSeo({
      name: formData.name,
      category: formData.category || 'Yono Games',
      bonus: formData.bonus,
      version: formData.version,
      size: formData.size,
      downloadUrl: formData.downloadUrl,
    });

    setFormData(prev => ({
      ...prev,
      slug: autoData.slug,
      seoTitle: autoData.seoTitle,
      seoDescription: autoData.seoDescription,
      tagline: prev.tagline || autoData.tagline,
      shortDescription: prev.shortDescription || autoData.shortDescription,
      description: prev.description || autoData.description,
      features: prev.features && prev.features.length > 0 ? prev.features : autoData.features,
      howToPlay: prev.howToPlay && prev.howToPlay.length > 0 ? prev.howToPlay : autoData.howToPlay,
    }));

    showToast('success', '⚡ High-Ranking SEO Metadata Generated Successfully!');
  };

  // Handle Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setFormData(prev => ({
          ...prev,
          logo: result.url,
          thumbnail: result.url,
          heroImage: result.url,
          screenshots: [result.url],
        }));
        showToast('success', `Image uploaded successfully: ${result.fileName}`);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      showToast('error', err.message || 'Error uploading image.');
    } finally {
      setIsUploading(false);
    }
  };

  // Quick Toggle Featured / New
  const handleQuickToggle = async (game: Game, field: 'featured' | 'newRelease') => {
    try {
      const updatedValue = !game[field];
      const res = await fetch('/api/admin/games', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: game.id,
          [field]: updatedValue,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setGames(prev => prev.map(g => g.id === game.id ? { ...g, [field]: updatedValue } : g));
        showToast('success', `${game.name}: ${field === 'featured' ? 'Featured' : 'New Release'} updated!`);
      }
    } catch (err) {
      showToast('error', 'Failed to update toggle.');
    }
  };

  // Submit Save / Publish
  const handleSubmitGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('error', 'Game Name is required.');
      return;
    }
    if (!formData.downloadUrl?.trim()) {
      showToast('error', 'Download APK URL is required.');
      return;
    }

    // Auto-fill SEO if empty
    const slug = formData.slug?.trim() || generateSlug(formData.name);
    const seoTitle = formData.seoTitle?.trim() || `${formData.name} APK Download (Official 2026) | Yono Games`;
    const seoDescription = formData.seoDescription?.trim() || `Download ${formData.name} official APK. Enjoy instant withdrawals and fair play.`;

    const payload = {
      ...formData,
      slug,
      seoTitle,
      seoDescription,
    };

    try {
      setIsSubmitting(true);
      const method = editingGame ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/games', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        showToast('success', editingGame ? 'Game updated successfully!' : '🎉 New game published live!');
        setIsModalOpen(false);
        fetchGames();
      } else {
        throw new Error(result.error || 'Failed to save game');
      }
    } catch (err: any) {
      console.error('Save game error:', err);
      showToast('error', err.message || 'Error saving game.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Game
  const handleDeleteGame = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/games?id=${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        setGames(prev => prev.filter(g => g.id !== id));
        showToast('success', 'Game removed successfully.');
        setDeleteConfirmId(null);
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete game.');
    }
  };

  // AUTH LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7FBF8] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#E4ECE7] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#087F5B]/10 rounded-2xl flex items-center justify-center mx-auto text-[#087F5B]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#172331]">Yono Admin Portal</h1>
            <p className="text-sm text-[#5D6B78]">Enter your passkey to manage games & SEO</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5D6B78] uppercase mb-1">
                Admin Email / Username
              </label>
              <input
                type="text"
                placeholder="Enter email or username"
                value={usernameInput}
                onChange={e => setUsernameInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D5E2D9] focus:outline-none focus:ring-2 focus:ring-[#087F5B] text-base"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5D6B78] uppercase mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D5E2D9] focus:outline-none focus:ring-2 focus:ring-[#087F5B] text-base"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 px-6 rounded-xl bg-[#087F5B] hover:bg-[#07553F] disabled:opacity-60 text-white font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Unlock Dashboard</span>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#EEF3F0] text-center">
            <Link href="/" className="text-xs font-semibold text-[#087F5B] hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Yono Games Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FBF8] text-[#172331]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-medium text-sm transition-all transform animate-bounce ${toastMessage.type === 'success' ? 'bg-[#087F5B]' : 'bg-red-600'
            }`}
        >
          {toastMessage.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E4ECE7] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#D5E2D9]">
              <Image src="/images/logo.png" alt="Real Yono Games" fill className="object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-[#172331]">Real Yono Games</span>
                <span className="text-[11px] font-semibold bg-[#087F5B]/10 text-[#087F5B] px-2 py-0.5 rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-[#5D6B78]">Instant Game Management & Auto-SEO Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#5D6B78] hover:text-[#087F5B] bg-[#F1F6F3] hover:bg-[#E4ECE7] transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Dashboard Section Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4ECE7] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSection('games')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                activeSection === 'games'
                  ? 'bg-[#087F5B] text-white shadow-md'
                  : 'text-[#5D6B78] hover:text-[#172331] bg-white border border-[#E4ECE7]'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Games Catalog</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeSection === 'games' ? 'bg-white/20 text-white' : 'bg-[#E4ECE7] text-[#5D6B78]'
                }`}
              >
                {games.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSection('messages')}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                activeSection === 'messages'
                  ? 'bg-[#087F5B] text-white shadow-md'
                  : 'text-[#5D6B78] hover:text-[#172331] bg-white border border-[#E4ECE7]'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Contact Inquiries</span>
              {unreadMessagesCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-[#172331] shadow-sm animate-pulse">
                  {unreadMessagesCount} New
                </span>
              ) : (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    activeSection === 'messages' ? 'bg-white/20 text-white' : 'bg-[#E4ECE7] text-[#5D6B78]'
                  }`}
                >
                  {messages.length}
                </span>
              )}
            </button>
          </div>

          {activeSection === 'messages' && (
            <div className="flex items-center gap-2 text-xs font-medium text-[#5D6B78] bg-white px-3.5 py-2 rounded-xl border border-[#E4ECE7]">
              <Mail className="w-3.5 h-3.5 text-[#087F5B]" />
              <span>Forwarding to:</span>
              <strong className="text-[#172331] font-mono">Yonogames2026@gmail.com</strong>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: GAMES CATALOG                                  */}
        {/* ========================================================= */}
        {activeSection === 'games' && (
          <>
            {/* KPI Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Total Games</span>
                  <Gamepad2 className="w-4 h-4 text-[#087F5B]" />
                </div>
                <p className="text-2xl font-bold text-[#172331] mt-2">{games.length}</p>
                <p className="text-[11px] text-[#087F5B] mt-1 font-medium">100% Live in Catalog</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Featured Games</span>
                  <Star className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-[#172331] mt-2">{games.filter(g => g.featured).length}</p>
                <p className="text-[11px] text-amber-600 mt-1 font-medium">Highlighted on Homepage</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">New Releases</span>
                  <Flame className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-[#172331] mt-2">{games.filter(g => g.newRelease).length}</p>
                <p className="text-[11px] text-emerald-600 mt-1 font-medium">In New Releases Slider</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Auto-SEO Status</span>
                  <Sparkles className="w-4 h-4 text-[#087F5B]" />
                </div>
                <p className="text-2xl font-bold text-[#087F5B] mt-2">Active</p>
                <p className="text-[11px] text-[#5D6B78] mt-1 font-medium">Google Rich Schema Enabled</p>
              </div>
            </div>

            {/* Action Header & Filters */}
            <div className="bg-white p-6 rounded-3xl border border-[#E4ECE7] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D6B78]" />
                  <input
                    type="text"
                    placeholder="Search games by name or category..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E2D9] focus:outline-none focus:ring-2 focus:ring-[#087F5B] text-sm"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#D5E2D9] bg-white text-xs font-semibold text-[#172331] focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Game</span>
              </button>
            </div>

            {/* Games Table */}
            <div className="bg-white rounded-3xl border border-[#E4ECE7] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#EEF3F0] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#172331]">All Games Directory ({filteredGames.length})</h2>
                  <p className="text-xs text-[#5D6B78]">Manage download links, images, categories, and SEO</p>
                </div>
                <button
                  onClick={fetchGames}
                  className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                  title="Refresh list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="p-16 text-center text-[#5D6B78]">Loading games...</div>
              ) : filteredGames.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Gamepad2 className="w-12 h-12 text-[#D5E2D9] mx-auto" />
                  <p className="text-base font-semibold text-[#5D6B78]">No games found</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#087F5B] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add your first game
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FBFA] text-xs font-semibold text-[#5D6B78] uppercase border-b border-[#EEF3F0]">
                      <tr>
                        <th className="py-3.5 px-6">Game Info</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Version & Size</th>
                        <th className="py-3.5 px-4 text-center">Featured</th>
                        <th className="py-3.5 px-4 text-center">New Release</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF3F0]">
                      {filteredGames.map(game => (
                        <tr key={game.id} className="hover:bg-[#FAFDFB] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#F1F6F3] border border-[#E4ECE7] shrink-0">
                                <Image
                                  src={game.logo || game.thumbnail || '/images/hero-full-ribbon-3d.png'}
                                  alt={game.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-sm text-[#172331] truncate">{game.name}</h3>
                                <p className="text-xs text-[#5D6B78] truncate max-w-xs">{game.tagline}</p>
                                <span className="text-[11px] text-[#087F5B] font-mono">/games/{game.slug}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-[#087F5B]/10 text-[#087F5B]">
                              {game.category}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-xs text-[#5D6B78]">
                            <div className="font-semibold text-[#172331]">{game.version || 'v1.0.0'}</div>
                            <div>{game.size || '38 MB'}</div>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleQuickToggle(game, 'featured')}
                              className={`w-9 h-5 rounded-full transition-colors relative inline-block ${
                                game.featured ? 'bg-[#087F5B]' : 'bg-[#D5E2D9]'
                              }`}
                            >
                              <span
                                className={`block w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${
                                  game.featured ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </td>

                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => handleQuickToggle(game, 'newRelease')}
                              className={`w-9 h-5 rounded-full transition-colors relative inline-block ${
                                game.newRelease ? 'bg-[#087F5B]' : 'bg-[#D5E2D9]'
                              }`}
                            >
                              <span
                                className={`block w-4 h-4 rounded-full bg-white transition-transform transform shadow-sm ${
                                  game.newRelease ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </td>

                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Link
                                href={`/games/${game.slug}`}
                                target="_blank"
                                className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                                title="View live page"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditModal(game)}
                                className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                                title="Edit game"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(game.id)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete game"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: CONTACT INQUIRIES                              */}
        {/* ========================================================= */}
        {activeSection === 'messages' && (
          <>
            {/* KPI Stats for Messages */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Total Inquiries</span>
                  <Inbox className="w-4 h-4 text-[#087F5B]" />
                </div>
                <p className="text-2xl font-bold text-[#172331] mt-2">{messages.length}</p>
                <p className="text-[11px] text-[#5D6B78] mt-1 font-medium">Received through Contact page</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Unread Messages</span>
                  <Mail className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-bold text-amber-600 mt-2">{unreadMessagesCount}</p>
                <p className="text-[11px] text-amber-600 mt-1 font-medium">
                  {unreadMessagesCount > 0 ? 'Requires attention' : 'All caught up'}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Resolved / Read</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-[#172331] mt-2">
                  {messages.filter(m => m.status === 'read').length}
                </p>
                <p className="text-[11px] text-emerald-600 mt-1 font-medium">Processed inquiries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E4ECE7] shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#5D6B78]">Email Dispatch</span>
                  <Sparkles className="w-4 h-4 text-[#087F5B]" />
                </div>
                <p className="text-sm font-bold text-[#087F5B] mt-2 truncate">Yonogames2026</p>
                <p className="text-[11px] text-[#5D6B78] mt-1 font-medium">Instant Inbox Notification</p>
              </div>
            </div>

            {/* Inquiries Filter Bar */}
            <div className="bg-white p-6 rounded-3xl border border-[#E4ECE7] shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5D6B78]" />
                  <input
                    type="text"
                    placeholder="Search by sender name, email, or keywords..."
                    value={messageSearchQuery}
                    onChange={e => setMessageSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5E2D9] focus:outline-none focus:ring-2 focus:ring-[#087F5B] text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#5D6B78]" />
                  <select
                    value={messageStatusFilter}
                    onChange={e => setMessageStatusFilter(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl border border-[#D5E2D9] bg-white text-xs font-semibold text-[#172331] focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                  >
                    <option value="all">All Inquiries ({messages.length})</option>
                    <option value="unread">Unread Only ({unreadMessagesCount})</option>
                    <option value="read">Read Only ({messages.length - unreadMessagesCount})</option>
                  </select>
                </div>
              </div>

              <button
                onClick={fetchMessages}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Inquiries</span>
              </button>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-3xl border border-[#E4ECE7] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#EEF3F0] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#172331]">
                    User Inquiries Directory ({filteredMessages.length})
                  </h2>
                  <p className="text-xs text-[#5D6B78]">
                    Messages submitted via Contact Us page. Direct replies can be sent instantly.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                  title="Refresh list"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {messagesLoading ? (
                <div className="p-16 text-center text-[#5D6B78]">Loading inquiries...</div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-16 text-center space-y-3">
                  <Inbox className="w-12 h-12 text-[#D5E2D9] mx-auto" />
                  <p className="text-base font-semibold text-[#5D6B78]">No inquiries found</p>
                  <p className="text-xs text-[#8A9BA8]">
                    When visitors submit the form on the Contact Us page, messages will appear here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#F8FBFA] text-xs font-semibold text-[#5D6B78] uppercase border-b border-[#EEF3F0]">
                      <tr>
                        <th className="py-3.5 px-6">Sender Details</th>
                        <th className="py-3.5 px-4">Inquiry Category</th>
                        <th className="py-3.5 px-4">Message Snippet</th>
                        <th className="py-3.5 px-4">Received Time</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EEF3F0]">
                      {filteredMessages.map(msg => (
                        <tr
                          key={msg.id}
                          className={`hover:bg-[#FAFDFB] transition-colors ${
                            msg.status === 'unread' ? 'bg-[#F4FAF7]/40' : ''
                          }`}
                        >
                          {/* Sender Details */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                  msg.status === 'unread'
                                    ? 'bg-[#087F5B] text-white'
                                    : 'bg-[#EEF3F0] text-[#5D6B78]'
                                }`}
                              >
                                {msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-sm text-[#172331] flex items-center gap-2">
                                  <span>{msg.name}</span>
                                  {msg.status === 'unread' && (
                                    <span className="w-2 h-2 rounded-full bg-[#087F5B] inline-block" />
                                  )}
                                </h3>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-[#087F5B] hover:underline flex items-center gap-1 truncate"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>{msg.email}</span>
                                </a>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-[#087F5B]/10 text-[#087F5B]">
                              {msg.category || 'General'}
                            </span>
                          </td>

                          {/* Message Snippet */}
                          <td className="py-4 px-4 max-w-xs">
                            <button
                              onClick={() => {
                                setViewingMessage(msg);
                                if (msg.status === 'unread') {
                                  handleToggleMessageStatus(msg, 'read');
                                }
                              }}
                              className="text-left text-xs text-[#5D6B78] hover:text-[#172331] line-clamp-2 transition-colors cursor-pointer"
                              title="Click to view full message"
                            >
                              {msg.message}
                            </button>
                          </td>

                          {/* Date/Time */}
                          <td className="py-4 px-4 text-xs text-[#5D6B78] whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium text-[#172331]">
                              <Clock className="w-3.5 h-3.5 text-[#8A9BA8]" />
                              <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-[11px] text-[#8A9BA8]">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            {msg.status === 'unread' ? (
                              <button
                                onClick={() => handleToggleMessageStatus(msg, 'read')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                                title="Click to mark as read"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                <span>Unread</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleMessageStatus(msg, 'unread')}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EEF3F0] text-[#5D6B78] hover:bg-[#E4ECE7] transition-colors"
                                title="Click to mark as unread"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Read</span>
                              </button>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => {
                                  setViewingMessage(msg);
                                  if (msg.status === 'unread') {
                                    handleToggleMessageStatus(msg, 'read');
                                  }
                                }}
                                className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                                title="View full inquiry"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <a
                                href={`mailto:${msg.email}?subject=Re:%20Real%20Yono%20Games%20-%20Inquiry%20regarding%20${encodeURIComponent(
                                  msg.category || 'Support'
                                )}`}
                                className="p-2 text-[#5D6B78] hover:text-[#087F5B] rounded-lg hover:bg-[#F1F6F3] transition-colors"
                                title="Reply via Email"
                              >
                                <Reply className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setDeleteMessageConfirmId(msg.id)}
                                className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* VIEW MESSAGE DETAILS MODAL */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#E4ECE7] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#EEF3F0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#087F5B]/10 text-[#087F5B] flex items-center justify-center font-bold text-lg">
                  {viewingMessage.name ? viewingMessage.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172331]">{viewingMessage.name}</h3>
                  <a
                    href={`mailto:${viewingMessage.email}`}
                    className="text-xs text-[#087F5B] hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{viewingMessage.email}</span>
                  </a>
                </div>
              </div>

              <button
                onClick={() => setViewingMessage(null)}
                className="p-2 text-[#5D6B78] hover:text-[#172331] rounded-xl hover:bg-[#E4ECE7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FBFA] p-4 rounded-2xl border border-[#E4ECE7] text-xs">
              <div>
                <span className="text-[#8A9BA8] block text-[11px] uppercase font-semibold">Category</span>
                <span className="font-bold text-[#087F5B]">{viewingMessage.category || 'General'}</span>
              </div>
              <div>
                <span className="text-[#8A9BA8] block text-[11px] uppercase font-semibold">Received On</span>
                <span className="font-medium text-[#172331]">
                  {new Date(viewingMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#8A9BA8] block text-[11px] uppercase font-semibold">Status</span>
                <span className="font-semibold text-[#172331] capitalize">{viewingMessage.status}</span>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#5D6B78] uppercase tracking-wider">
                Full Message Content
              </label>
              <div className="p-5 rounded-2xl bg-[#F7FBF8] border border-[#D5E2D9] text-sm text-[#172331] leading-relaxed whitespace-pre-wrap font-sans">
                {viewingMessage.message}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EEF3F0]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleMessageStatus(
                      viewingMessage,
                      viewingMessage.status === 'read' ? 'unread' : 'read'
                    )
                  }
                  className="px-4 py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3] transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {viewingMessage.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeleteMessageConfirmId(viewingMessage.id);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingMessage(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3] transition-colors"
                >
                  Close
                </button>

                <a
                  href={`mailto:${viewingMessage.email}?subject=Re:%20Real%20Yono%20Games%20-%20Inquiry%20regarding%20${encodeURIComponent(
                    viewingMessage.category || 'Support'
                  )}`}
                  className="px-5 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MESSAGE CONFIRMATION MODAL */}
      {deleteMessageConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E4ECE7] shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#172331]">Delete this inquiry?</h3>
              <p className="text-xs text-[#5D6B78]">
                This will permanently delete this message record from the admin dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteMessageConfirmId(null)}
                className="py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(deleteMessageConfirmId)}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE GAME CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#E4ECE7] shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#172331]">Delete this game?</h3>
              <p className="text-xs text-[#5D6B78]">This will permanently remove the game and its page from the live website.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteGame(deleteConfirmId)}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                Delete Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT GAME MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 border border-[#E4ECE7] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="p-6 border-b border-[#EEF3F0] flex items-center justify-between bg-[#F8FBFA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#087F5B]/10 rounded-xl flex items-center justify-center text-[#087F5B]">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#172331]">
                    {editingGame ? `Edit: ${editingGame.name}` : 'Add New Game'}
                  </h3>
                  <p className="text-xs text-[#5D6B78]">Fill details below. Use the Auto-SEO button for 1-click optimization.</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#5D6B78] hover:text-[#172331] rounded-xl hover:bg-[#E4ECE7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#EEF3F0] px-6 bg-white">
              <button
                type="button"
                onClick={() => setActiveModalTab('basic')}
                className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${activeModalTab === 'basic'
                    ? 'border-[#087F5B] text-[#087F5B]'
                    : 'border-transparent text-[#5D6B78] hover:text-[#172331]'
                  }`}
              >
                1. Basic Info & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('content')}
                className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all ${activeModalTab === 'content'
                    ? 'border-[#087F5B] text-[#087F5B]'
                    : 'border-transparent text-[#5D6B78] hover:text-[#172331]'
                  }`}
              >
                2. Overview & Rules
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab('seo')}
                className={`py-3 px-4 font-semibold text-xs border-b-2 transition-all flex items-center gap-1.5 ${activeModalTab === 'seo'
                    ? 'border-[#087F5B] text-[#087F5B]'
                    : 'border-transparent text-[#5D6B78] hover:text-[#172331]'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>3. ⚡ Auto-SEO Engine</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitGame} className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* TAB 1: BASIC INFO & MEDIA */}
              {activeModalTab === 'basic' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                        Game Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Yono 777 Gold"
                        value={formData.name || ''}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category || 'Yono Games'}
                        onChange={e => setFormData({ ...formData, category: e.target.value, categories: [e.target.value] })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B] bg-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                      View External Application <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://realyonogame.com/download/game.apk"
                      value={formData.downloadUrl || ''}
                      onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">Version</label>
                      <input
                        type="text"
                        placeholder="v5.1.0"
                        value={formData.version || ''}
                        onChange={e => setFormData({ ...formData, version: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">APK Size</label>
                      <input
                        type="text"
                        placeholder="42.5 MB"
                        value={formData.size || ''}
                        onChange={e => setFormData({ ...formData, size: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">Welcome Bonus</label>
                      <input
                        type="text"
                        placeholder="₹1,500 Welcome Bonus"
                        value={formData.bonus || ''}
                        onChange={e => setFormData({ ...formData, bonus: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>
                  </div>

                  {/* Image Upload Area */}
                  <div className="bg-[#F8FBFA] p-5 rounded-2xl border border-[#E4ECE7] space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#172331] uppercase">Game Logo / Artwork</h4>
                        <p className="text-[11px] text-[#5D6B78]">Upload an image from your computer or paste an image link</p>
                      </div>
                      {isUploading && (
                        <span className="text-xs font-semibold text-[#087F5B] animate-pulse flex items-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Image Preview */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-[#D5E2D9] shrink-0 shadow-sm">
                        <Image
                          src={formData.logo || '/images/hero-full-ribbon-3d.png'}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="block w-full text-xs text-[#5D6B78] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#087F5B] file:text-white hover:file:bg-[#07553F] cursor-pointer"
                        />
                        <div className="text-[11px] text-[#5D6B78]">
                          Or direct image path:{' '}
                          <input
                            type="text"
                            value={formData.logo || ''}
                            onChange={e => setFormData({
                              ...formData,
                              logo: e.target.value,
                              thumbnail: e.target.value,
                              heroImage: e.target.value,
                              screenshots: [e.target.value]
                            })}
                            className="w-full mt-1 px-2.5 py-1 rounded-lg border border-[#D5E2D9] text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172331]">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded text-[#087F5B] focus:ring-[#087F5B] w-4 h-4"
                      />
                      <span>Featured on Homepage</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#172331]">
                      <input
                        type="checkbox"
                        checked={formData.newRelease || false}
                        onChange={e => setFormData({ ...formData, newRelease: e.target.checked })}
                        className="rounded text-[#087F5B] focus:ring-[#087F5B] w-4 h-4"
                      />
                      <span>Show in "New Releases" Slider</span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: OVERVIEW & RULES */}
              {activeModalTab === 'content' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">Catchy Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. India's Flagship Luxury Reel & Jackpot Experience"
                      value={formData.tagline || ''}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">Short Description (for Game Cards)</label>
                    <textarea
                      rows={2}
                      placeholder="Brief teaser displayed on browse cards..."
                      value={formData.shortDescription || ''}
                      onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">Full In-Depth Description</label>
                    <textarea
                      rows={4}
                      placeholder="Detailed gameplay rules, certified RNG mechanics, features..."
                      value={formData.description || ''}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                    />
                  </div>

                  {/* Features List */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                      Key Highlights & Features (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.features || []).join('\n')}
                      onChange={e => setFormData({
                        ...formData,
                        features: e.target.value.split('\n').filter(Boolean)
                      })}
                      placeholder="Certified RNG fair play standard&#10;Instant UPI withdrawals&#10;Daily login rewards"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B] font-mono text-xs"
                    />
                  </div>

                  {/* How to Play */}
                  <div>
                    <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                      How to Play Instructions (1 step per line)
                    </label>
                    <textarea
                      rows={3}
                      value={(formData.howToPlay || []).join('\n')}
                      onChange={e => setFormData({
                        ...formData,
                        howToPlay: e.target.value.split('\n').filter(Boolean)
                      })}
                      placeholder="Download and install APK&#10;Claim welcome bonus&#10;Place bets and win"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B] font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AUTO-SEO ENGINE */}
              {activeModalTab === 'seo' && (
                <div className="space-y-6">
                  {/* One Click Generator Banner */}
                  <div className="bg-gradient-to-r from-[#087F5B] to-[#07553F] p-5 rounded-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-base">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>1-Click Auto-SEO Generator</span>
                      </div>
                      <p className="text-xs text-white/80">
                        Automatically calculates optimal URL slug, ranking meta title, meta description, and Google JSON-LD schema.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAutoSeo}
                      className="px-5 py-2.5 bg-white text-[#087F5B] rounded-xl text-xs font-bold shadow-md hover:bg-amber-300 hover:text-[#172331] transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>⚡ Generate SEO Now</span>
                    </button>
                  </div>

                  {/* LIVE GOOGLE SEARCH SERP PREVIEW */}
                  <div className="bg-white p-5 rounded-2xl border border-[#D5E2D9] shadow-sm space-y-2">
                    <span className="text-[11px] font-bold text-[#5D6B78] uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#087F5B]" /> Live Google Search Result Preview
                    </span>

                    <div className="p-4 bg-[#F8FBFA] rounded-xl border border-[#E4ECE7] font-sans space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#202124]">
                        <div className="w-4 h-4 rounded-full bg-[#087F5B] text-[9px] text-white flex items-center justify-center font-bold">Y</div>
                        <span className="font-medium">realyonogame.com</span>
                        <span className="text-[#5f6368]">› games › {formData.slug || 'game-slug'}</span>
                      </div>
                      <h4 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug">
                        {formData.seoTitle || `${formData.name || 'Game Name'} APK Download (Official 2026) - Free Bonus | Yono Games`}
                      </h4>
                      <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                        {formData.seoDescription || `Download ${formData.name || 'Game Name'} official APK (${formData.version || 'v5.1.0'}). Enjoy ${formData.bonus || 'instant bonus'}, verified fair RNG play, fast UPI withdrawals on India's favourite platform.`}
                      </p>
                    </div>
                  </div>

                  {/* Editable SEO Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5D6B78] mb-1">
                        URL Slug (Web Address)
                      </label>
                      <div className="flex items-center">
                        <span className="bg-[#EEF3F0] px-3 py-2.5 rounded-l-xl text-xs font-mono text-[#5D6B78] border border-r-0 border-[#D5E2D9]">
                          /games/
                        </span>
                        <input
                          type="text"
                          placeholder="yono-777-gold"
                          value={formData.slug || ''}
                          onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                          className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-[#D5E2D9] text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-[#5D6B78]">SEO Meta Title (Google Page Title)</label>
                        <span className="text-[11px] text-[#5D6B78]">
                          {(formData.seoTitle || '').length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={formData.seoTitle || ''}
                        onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder="Game Title APK Download (Official 2026) - Free Bonus | Yono Games"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-[#5D6B78]">SEO Meta Description (Google Snippet)</label>
                        <span className="text-[11px] text-[#5D6B78]">
                          {(formData.seoDescription || '').length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={formData.seoDescription || ''}
                        onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
                        placeholder="Download official APK with instant cashouts..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5E2D9] text-sm focus:outline-none focus:ring-2 focus:ring-[#087F5B]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Google Rich Snippet Schema:</strong> A valid Google <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">SoftwareApplication</code> JSON-LD schema is automatically injected into the page head so Google Search recognizes this as an official downloadable game application.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions Footer */}
              <div className="pt-6 border-t border-[#EEF3F0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#D5E2D9] text-xs font-semibold text-[#5D6B78] hover:bg-[#F1F6F3] transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#087F5B] hover:bg-[#07553F] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving & Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingGame ? 'Save Changes' : 'Publish Game Live'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
